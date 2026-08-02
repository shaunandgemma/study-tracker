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
DATA_DIR = r"C:\tmp\chrome_dev_profile_final_sync"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-214900"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("=== EXECUTING REMAINING E2E WORKFLOWS ===")
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

async def run_workflows():
    async with websockets.connect(ws_url) as ws:
        await call_cdp(ws, "Page.enable")
        await call_cdp(ws, "Runtime.enable")
        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # 1. Targeted Quiz - High Volume (Amazon S3) & Lower Volume (Analytics)
        print("\n--- TARGETED QUIZ ---")
        await eval_js(ws, "Array.from(document.querySelectorAll('button, div, span')).find(b => b.textContent.includes('Amazon S3') || b.textContent.includes('S3'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "targeted-quiz-high-volume.png")

        await eval_js(ws, "Array.from(document.querySelectorAll('button, div, span')).find(b => b.textContent.includes('Analytics') || b.textContent.includes('Streaming'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "targeted-quiz-low-volume.png")

        # 2. Hands-On Tasks Detail & Checklist
        print("\n--- HANDS-ON TASKS ---")
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hands-On Tasks'))?.click()")
        await asyncio.sleep(2)

        # Open Task Detail
        await eval_js(ws, "document.querySelector('button, div[class*=\"task\"], table tbody tr')?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "task-detail-guide.png")

        # Toggle Checklist Checkbox
        await eval_js(ws, "document.querySelector('input[type=\"checkbox\"]')?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "checklist-item-toggled.png")

        # Refresh page for persistence check
        await call_cdp(ws, "Page.reload")
        await asyncio.sleep(2)
        await save_shot(ws, "checklist-persistence-after-refresh.png")

        # Open Reset Dialog
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "reset-dialog-open.png")

        # Cancel Reset
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cancel'))?.click()")
        await asyncio.sleep(1)

        # Reopen and Confirm Reset
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset'))?.click()")
        await asyncio.sleep(1)
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Reset Task'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "task-reset-confirmed.png")

        # 3. Exam Submission & Explanation View
        print("\n--- EXAM SUBMISSION & EXPLANATION ---")
        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(1)
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Start') || b.textContent.includes('Exam') || b.textContent.includes('Quiz'))?.click()")
        await asyncio.sleep(1.5)

        # Submit
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(1)
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Yes') || b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(1.5)
        await save_shot(ws, "results-page.png")

        # Open Explanation
        await eval_js(ws, "Array.from(document.querySelectorAll('button, summary, details')).find(b => b.textContent.includes('Explanation') || b.textContent.includes('Review'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "explanation-view.png")

try:
    asyncio.run(run_workflows())
finally:
    proc.terminate()
    print("=== WORKFLOW SUITE COMPLETED ===")
