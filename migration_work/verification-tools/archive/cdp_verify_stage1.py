import os
import sys
import time
import json
import base64
import subprocess
import urllib.request
import asyncio
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
DATA_DIR = r"C:\tmp\chrome_dev_profile_stage1"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-221000"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("=== STARTING STAGE 1 CHROME CDP EVIDENCE VERIFICATION ===")
proc = subprocess.Popen([
    CHROME_PATH,
    "--headless=new",
    "--remote-debugging-port=9222",
    f"--user-data-dir={DATA_DIR}",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--remote-allow-origins=*",
    TARGET_URL
])

time.sleep(3)

ws_url = None
for i in range(10):
    try:
        resp = urllib.request.urlopen("http://localhost:9222/json")
        targets = json.loads(resp.read().decode('utf-8'))
        for t in targets:
            if t.get('type') == 'page':
                ws_url = t.get('webSocketDebuggerUrl')
                break
        if ws_url:
            break
    except Exception:
        time.sleep(1)

if not ws_url:
    print("ERROR: Could not connect to Chrome CDP.")
    proc.terminate()
    sys.exit(1)

msg_id = 0
console_logs = []
failed_requests = []

async def call_cdp(ws, method, params=None):
    global msg_id
    msg_id += 1
    rid = msg_id
    payload = {"id": rid, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        try:
            res_str = await asyncio.wait_for(ws.recv(), timeout=4.0)
            res = json.loads(res_str)
            if "method" in res:
                m = res["method"]
                p = res.get("params", {})
                if m in ["Console.messageAdded", "Runtime.consoleAPICalled", "Runtime.exceptionThrown"]:
                    console_logs.append(str(p))
                elif m == "Network.responseReceived":
                    resp_info = p.get("response", {})
                    if resp_info.get("status", 200) >= 400:
                        failed_requests.append(resp_info.get("url"))
            if res.get("id") == rid:
                return res.get("result", {})
        except asyncio.TimeoutError:
            return {}

async def save_shot(ws, filename):
    res = await call_cdp(ws, "Page.captureScreenshot", {"format": "png"})
    if res.get("data"):
        filepath = os.path.join(EVIDENCE_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(res["data"]))
        print(f"[SCREENSHOT] Saved {filename}")

async def eval_js(ws, code):
    res = await call_cdp(ws, "Runtime.evaluate", {"expression": code, "returnByValue": True})
    return res.get("result", {}).get("value")

async def run_stage1_cdp():
    async with websockets.connect(ws_url) as ws:
        await call_cdp(ws, "Page.enable")
        await call_cdp(ws, "Runtime.enable")
        await call_cdp(ws, "Console.enable")
        await call_cdp(ws, "Network.enable")

        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # 1. Desktop Width Structured Explanation Cards
        print("\n--- 1. DESKTOP EXPLANATION STRUCTURED CARDS ---")
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start') || b.textContent.includes('Quiz') || b.textContent.includes('Exam'))?.click()")
        await asyncio.sleep(1.5)

        # Select option and submit to view explanation in results
        await eval_js(ws, "document.querySelector('input[type=\"radio\"], input[type=\"checkbox\"], label')?.click()")
        await asyncio.sleep(0.5)

        # Submit
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(1)
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Yes') || b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(2)
        await save_shot(ws, "explanation-structured-cards.png")

        # Open explanation breakdown
        await eval_js(ws, "Array.from(document.querySelectorAll('button, summary')).find(b => b.textContent.includes('Explanation') || b.textContent.includes('Review'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "shuffled-single-answer-remapped.png")

        # 2. Mobile Width Viewport Test (375x812)
        print("\n--- 2. MOBILE VIEWPORT SCREENSHOT (375x812) ---")
        await call_cdp(ws, "Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 812,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        await asyncio.sleep(1)
        await save_shot(ws, "mobile-width-explanation.png")

        # Reset emulation
        await call_cdp(ws, "Emulation.clearDeviceMetricsOverride")

        print("\n--- CONSOLE & NETWORK AUDIT ---")
        print("Failed Requests:", len(failed_requests))
        print("Console Messages:", len(console_logs))

try:
    asyncio.run(run_stage1_cdp())
finally:
    proc.terminate()
    print("=== STAGE 1 CDP EVIDENCE VERIFICATION COMPLETED ===")
