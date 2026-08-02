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
DATA_DIR = r"C:\tmp\chrome_dev_profile_e2e_final"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-214900"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("=== STARTING COMPLETE CHROME CDP E2E WORKFLOW SUITE ===")
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
    print("ERROR: Could not get WebSocketDebuggerUrl.")
    proc.terminate()
    sys.exit(1)

msg_id = 0
console_logs = []
network_requests = []
supabase_requests = []
failed_requests = []

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
            if "method" in res:
                m = res["method"]
                p = res.get("params", {})
                if m in ["Console.messageAdded", "Runtime.consoleAPICalled", "Runtime.exceptionThrown"]:
                    console_logs.append(str(p))
                elif m == "Network.responseReceived":
                    resp_info = p.get("response", {})
                    url = resp_info.get("url", "")
                    status = resp_info.get("status")
                    req_item = {"url": url.split('?')[0], "status": status}
                    network_requests.append(req_item)
                    if status >= 400:
                        failed_requests.append(req_item)
                    if "supabase.co" in url:
                        supabase_requests.append(req_item)
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

async def run_final_e2e():
    async with websockets.connect(ws_url) as ws:
        await call_cdp(ws, "Page.enable")
        await call_cdp(ws, "Runtime.enable")
        await call_cdp(ws, "Console.enable")
        await call_cdp(ws, "Network.enable")

        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # 1. Complete Mock Exam Workflow
        print("\n--- 1. COMPLETE MOCK EXAM WORKFLOW ---")
        # Click Start Exam / Quick Quiz
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Quick Quiz') || b.textContent.includes('Start') || b.textContent.includes('Exam'))?.click()")
        await asyncio.sleep(2)
        
        # Check initial question view
        q_text = await eval_js(ws, "document.querySelector('.question-text, h3, h2, p')?.textContent || document.body.innerText")
        print("Question View Loaded:\n", repr(q_text[:150]))

        # Select first option
        await eval_js(ws, "document.querySelector('input[type=\"radio\"], input[type=\"checkbox\"], .option-card, label')?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "single-answer-selection.png")

        # Click Next button
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next'))?.click()")
        await asyncio.sleep(1)

        # Check for multiple-answer question or select option on Q2
        await eval_js(ws, "document.querySelector('input[type=\"checkbox\"], input[type=\"radio\"], .option-card, label')?.click()")
        await asyncio.sleep(0.5)
        await save_shot(ws, "multiple-answer-selection.png")

        # Click Previous button to test retention
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Previous') || b.textContent.includes('Prev'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "retained-answer-nav.png")

        # Click Submit Exam
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(2)

        # Confirm submit dialog if present
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Yes') || b.textContent.includes('Submit'))?.click()")
        await asyncio.sleep(2)
        await save_shot(ws, "results-page.png")

        score_text = await eval_js(ws, "document.body.innerText")
        print("Results Screen Text:\n", repr(score_text[:300]))

        # Open explanation
        await eval_js(ws, "Array.from(document.querySelectorAll('button, summary, details')).find(b => b.textContent.includes('Explanation') || b.textContent.includes('Review') || b.textContent.includes('Show'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "explanation-view.png")

        # 2. Targeted Quiz Workflow
        print("\n--- 2. TARGETED QUIZ WORKFLOW ---")
        await call_cdp(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        # Click topic pill e.g. Amazon S3
        await eval_js(ws, "Array.from(document.querySelectorAll('button, div, span')).find(b => b.textContent.includes('Amazon S3') || b.textContent.includes('S3'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "targeted-quiz-topic-selected.png")

        # 3. Hands-On Tasks Detail & Checklist Persistence
        print("\n--- 3. HANDS-ON TASK DETAIL WORKFLOW ---")
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hands-On Tasks'))?.click()")
        await asyncio.sleep(2)

        # Click first task in list to open guide
        await eval_js(ws, "document.querySelector('.task-card, .task-item, table tbody tr, div[class*=\"task\"]')?.click()")
        await asyncio.sleep(1.5)
        await save_shot(ws, "task-detail-guide.png")

        # Toggle first checklist checkbox
        await eval_js(ws, "document.querySelector('input[type=\"checkbox\"]')?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "checklist-item-toggled.png")

        # Check localStorage persistence
        ls_before = await eval_script(ws, "JSON.stringify(localStorage)")
        print("LocalStorage after toggle:", ls_before)

        # Refresh page to test persistence
        await call_cdp(ws, "Page.reload")
        await asyncio.sleep(2)
        await save_shot(ws, "checklist-persistence-after-refresh.png")

        # Open reset dialog & cancel
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "reset-dialog-open.png")

        # Click Cancel
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cancel'))?.click()")
        await asyncio.sleep(1)

        # Open reset dialog again & confirm
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset'))?.click()")
        await asyncio.sleep(1)
        await eval_js(ws, "Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Confirm') || b.textContent.includes('Reset Task'))?.click()")
        await asyncio.sleep(1)
        await save_shot(ws, "task-reset-confirmed.png")

        # 4. Navigation & Route Persistence
        print("\n--- 4. BROWSER NAVIGATION & ROUTING ---")
        nav_url_1 = await eval_script(ws, "window.location.href")
        print(f"Current route after reset: {nav_url_1}")

        print("\n--- 5. SUPABASE & NETWORK SUMMARY ---")
        print("Captured Supabase Requests:")
        for r in supabase_requests:
            print(f" - {r['url']} | Status: {r['status']}")
        print("Captured Failed Requests (>=400):", len(failed_requests))

try:
    asyncio.run(run_final_e2e())
finally:
    proc.terminate()
    print("=== CDP COMPLETE WORKFLOW SUITE COMPLETED ===")
