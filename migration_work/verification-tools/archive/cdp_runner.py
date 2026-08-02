import os
import sys
import time
import json
import subprocess
import urllib.request
import asyncio
import websockets

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
DATA_DIR = r"C:\tmp\chrome_dev_profile"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-214300"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("Starting Chrome process...")
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
        print("CDP targets found:", len(targets))
        for t in targets:
            if t.get('type') == 'page':
                ws_url = t.get('webSocketDebuggerUrl')
                break
        if ws_url:
            break
    except Exception as e:
        print(f"Waiting for Chrome CDP... ({e})")
        time.sleep(1)

if not ws_url:
    print("ERROR: Could not get WebSocketDebuggerUrl from Chrome.")
    proc.terminate()
    sys.exit(1)

print("Connected CDP WebSocket URL:", ws_url)

msg_id = 0

async def cdp_call(ws, method, params=None):
    global msg_id
    msg_id += 1
    req_id = msg_id
    payload = {"id": req_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        res_str = await ws.recv()
        res = json.loads(res_str)
        if res.get("id") == req_id:
            return res.get("result", {})

async def run_audit():
    async with websockets.connect(ws_url) as ws:
        print("Enabling Page, Runtime, Network domains...")
        await cdp_call(ws, "Page.enable")
        await cdp_call(ws, "Runtime.enable")
        await cdp_call(ws, "Network.enable")
        await cdp_call(ws, "DOM.enable")

        print("Navigating to target URL...")
        await cdp_call(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # Get Title & Evaluation
        title_res = await cdp_call(ws, "Runtime.evaluate", {"expression": "document.title"})
        print("Page Title:", title_res.get("result", {}).get("value"))

        eval_res = await cdp_call(ws, "Runtime.evaluate", {"expression": "document.body.innerText"})
        body_text = eval_res.get("result", {}).get("value", "")
        print("Body Text Preview (first 200 chars):", repr(body_text[:200]))

        # Capture initial screenshot
        scr_res = await cdp_call(ws, "Page.captureScreenshot", {"format": "png"})
        import base64
        with open(os.path.join(EVIDENCE_DIR, "initial-page.png"), "wb") as f:
            f.write(base64.b64decode(scr_res.get("data", "")))
        print("Saved initial-page.png successfully!")

        # Check LocalStorage & SessionStorage
        ls_res = await cdp_call(ws, "Runtime.evaluate", {"expression": "JSON.stringify(localStorage)"})
        ss_res = await cdp_call(ws, "Runtime.evaluate", {"expression": "JSON.stringify(sessionStorage)"})
        print("LocalStorage content:", ls_res.get("result", {}).get("value"))
        print("SessionStorage content:", ss_res.get("result", {}).get("value"))

asyncio.run(run_audit())
proc.terminate()
