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
DATA_DIR = r"C:\tmp\chrome_dev_profile_e2e_sync"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-214300"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("=== STARTING REAL CHROME CDP E2E SUITE ===")
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
    print("ERROR: Could not connect to Chrome CDP WebSocket.")
    proc.terminate()
    sys.exit(1)

print("Connected CDP WebSocket:", ws_url)

msg_id = 0

async def call_cdp(ws, method, params=None):
    global msg_id
    msg_id += 1
    rid = msg_id
    payload = {"id": rid, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        try:
            res_str = await asyncio.wait_for(ws.recv(), timeout=5.0)
            res = json.loads(res_str)
            if res.get("id") == rid:
                return res.get("result", {})
        except asyncio.TimeoutError:
            print(f"CDP Call Timeout for {method}")
            return {}

async def save_shot(ws, filename):
    res = await call_cdp(ws, "Page.captureScreenshot", {"format": "png"})
    if res.get("data"):
        filepath = os.path.join(EVIDENCE_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(res["data"]))
        print(f"[SCREENSHOT] Saved {filename}")

async def eval_script(ws, code):
    res = await call_cdp(ws, "Runtime.evaluate", {"expression": code, "returnByValue": True})
    return res.get("result", {}).get("value")

async def run_all():
    async with websockets.connect(ws_url) as ws:
        await call_cdp(ws, "Page.enable")
        await call_cdp(ws, "Runtime.enable")
        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # Phase 1: Basic Load
        title = await eval_script(ws, "document.title")
        url = await eval_script(ws, "window.location.href")
        print(f"Phase 1 - Title: {title} | URL: {url}")
        await save_shot(ws, "initial-page.png")

        # Phase 2: Navigation Buttons
        body_text = await eval_script(ws, "document.body.innerText")
        print("Phase 2 - Initial Body Preview:\n", body_text[:300])

        # Click "Hands-On Tasks" if found in text
        await eval_script(ws, """
        Array.from(document.querySelectorAll('button, a, div')).find(e => e.textContent.includes('Hands-On Tasks'))?.click()
        """)
        await asyncio.sleep(2)
        tasks_url = await eval_script(ws, "window.location.href")
        print(f"Phase 2 - Navigated to Tasks: {tasks_url}")
        await save_shot(ws, "nav-hands-on-tasks.png")

        # Click "Prep Exam" if found
        await eval_script(ws, """
        Array.from(document.querySelectorAll('button, a, div')).find(e => e.textContent.includes('Prep Exam'))?.click()
        """)
        await asyncio.sleep(2)
        exam_url = await eval_script(ws, "window.location.href")
        print(f"Phase 2 - Navigated to Exam: {exam_url}")
        await save_shot(ws, "nav-prep-exam.png")

        # Phase 3: Start Exam
        await eval_script(ws, """
        Array.from(document.querySelectorAll('button')).find(e => e.textContent.includes('Start') || e.textContent.includes('Quiz') || e.textContent.includes('Exam'))?.click()
        """)
        await asyncio.sleep(2)
        await save_shot(ws, "exam-start.png")

        # Phase 6: Check Secrets in LocalStorage & SessionStorage
        ls = await eval_script(ws, "JSON.stringify(localStorage)")
        ss = await eval_script(ws, "JSON.stringify(sessionStorage)")
        print("Phase 6 - LocalStorage:", ls)
        print("Phase 6 - SessionStorage:", ss)

try:
    asyncio.run(run_all())
finally:
    proc.terminate()
    print("=== CDP E2E SUITE COMPLETED CLEANLY ===")
