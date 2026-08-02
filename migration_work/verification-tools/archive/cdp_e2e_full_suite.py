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
DATA_DIR = r"C:\tmp\chrome_dev_profile_e2e"
TARGET_URL = "http://localhost:4173"
EVIDENCE_DIR = r"migration_work\browser-evidence\2026-08-02-214300"

os.makedirs(EVIDENCE_DIR, exist_ok=True)

print("Starting Chrome CDP Process for E2E Suite...")
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
network_requests = []
failed_requests = []
supabase_requests = []

async def cdp_call(ws, method, params=None):
    global msg_id
    msg_id += 1
    req_id = msg_id
    payload = {"id": req_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        res_str = await ws.recv()
        res = json.loads(res_str)
        if "method" in res:
            # Handle CDP events
            m = res["method"]
            p = res.get("params", {})
            if m == "Console.messageAdded":
                msg = p.get("message", {})
                console_logs.append(f"[{msg.get('level')}] {msg.get('text')}")
            elif m == "Runtime.consoleAPICalled":
                args = [str(a.get("value", a.get("description", ""))) for a in p.get("args", [])]
                console_logs.append(f"[{p.get('type')}] {' '.join(args)}")
            elif m == "Runtime.exceptionThrown":
                exp = p.get("exceptionDetails", {})
                console_logs.append(f"[EXCEPTION] {exp.get('text')} {exp.get('exception', {}).get('description', '')}")
            elif m == "Network.responseReceived":
                resp_info = p.get("response", {})
                url = resp_info.get("url", "")
                status = resp_info.get("status")
                req_data = {"url": url, "status": status, "type": p.get("type")}
                network_requests.append(req_data)
                if status >= 400:
                    failed_requests.append(req_data)
                if "supabase.co" in url:
                    supabase_requests.append(req_data)
        if res.get("id") == req_id:
            return res.get("result", {})

async def save_screenshot(ws, filename):
    scr_res = await cdp_call(ws, "Page.captureScreenshot", {"format": "png"})
    filepath = os.path.join(EVIDENCE_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(base64.b64decode(scr_res.get("data", "")))
    print(f"Saved screenshot: {filename}")

async def eval_js(ws, expr):
    res = await cdp_call(ws, "Runtime.evaluate", {"expression": expr, "returnByValue": True})
    return res.get("result", {}).get("value")

async def click_selector(ws, selector):
    js = f"""
    (() => {{
        const el = document.querySelector('{selector}');
        if (el) {{
            el.click();
            return true;
        }}
        return false;
    }})()
    """
    return await eval_js(ws, js)

async def click_text(ws, text):
    js = f"""
    (() => {{
        const elements = Array.from(document.querySelectorAll('button, a, div, span'));
        const el = elements.find(e => e.textContent.strip ? e.textContent.strip() === '{text}' : e.textContent.trim() === '{text}');
        if (el) {{
            el.click();
            return true;
        }}
        return false;
    }})()
    """
    return await eval_js(ws, js)

async def run_e2e_suite():
    async with websockets.connect(ws_url) as ws:
        print("\n--- PHASE 1: INITIAL BROWSER LOAD ---")
        await cdp_call(ws, "Page.enable")
        await cdp_call(ws, "Runtime.enable")
        await cdp_call(ws, "Console.enable")
        await cdp_call(ws, "Network.enable")

        await cdp_call(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(2)

        title = await eval_js(ws, "document.title")
        curr_url = await eval_js(ws, "window.location.href")
        body_text = await eval_js(ws, "document.body.innerText")

        print(f"Title: {title}")
        print(f"URL: {curr_url}")
        print(f"Header Text: {body_text[:150]}...")
        await save_screenshot(ws, "initial-page.png")

        print("\n--- PHASE 2: NAVIGATION TESTING ---")
        # Click Hands-On Tasks
        clicked_tasks = await click_selector(ws, "button:nth-child(3)") or await click_text(ws, "Hands-On Tasks")
        await asyncio.sleep(1.5)
        tasks_url = await eval_js(ws, "window.location.href")
        print(f"Navigated to Tasks URL: {tasks_url}")
        await save_screenshot(ws, "nav-hands-on-tasks.png")

        # Click Prep Exam
        clicked_exam = await click_selector(ws, "button:nth-child(2)") or await click_text(ws, "Prep Exam")
        await asyncio.sleep(1.5)
        exam_url = await eval_js(ws, "window.location.href")
        print(f"Navigated to Exam URL: {exam_url}")
        await save_screenshot(ws, "nav-prep-exam.png")

        # Test Browser Back & Forward
        await cdp_call(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(1)

        print("\n--- PHASE 3: MOCK EXAM WORKFLOW ---")
        # Start a practice exam or quiz
        start_btn = await click_text(ws, "Start Exam") or await click_text(ws, "Start Quick Quiz") or await click_selector(ws, ".primary-btn, button")
        await asyncio.sleep(2)
        await save_screenshot(ws, "exam-start.png")

        exam_body = await eval_js(ws, "document.body.innerText")
        print("Exam Screen Text Preview:", repr(exam_body[:200]))

        # Select first option
        opt1_clicked = await click_selector(ws, "input[type='radio'], input[type='checkbox'], label")
        await asyncio.sleep(0.5)
        await save_screenshot(ws, "selected-answer.png")

        print("\n--- PHASE 5: HANDS-ON TASKS INTERACTION ---")
        # Return to Tasks view
        await cdp_call(ws, "Page.navigate", {"url": TARGET_URL})
        await asyncio.sleep(1)
        await click_text(ws, "Hands-On Tasks")
        await asyncio.sleep(1.5)

        task_count_text = await eval_js(ws, "document.body.innerText")
        print("Hands-On Tasks View Text Preview:", repr(task_count_text[:250]))
        await save_screenshot(ws, "hands-on-tasks-catalogue.png")

        # Refresh page to verify persistence
        await cdp_call(ws, "Page.reload")
        await asyncio.sleep(2)
        reload_url = await eval_js(ws, "window.location.href")
        print(f"Reloaded Page URL: {reload_url}")

        print("\n--- PHASE 6: SUPABASE & SECRETS AUDIT ---")
        ls_data = await eval_js(ws, "JSON.stringify(localStorage)")
        ss_data = await eval_js(ws, "JSON.stringify(sessionStorage)")
        html_data = await eval_js(ws, "document.documentElement.outerHTML")

        print(f"LocalStorage keys: {list(json.loads(ls_data).keys()) if ls_data else []}")
        print(f"SessionStorage keys: {list(json.loads(ss_data).keys()) if ss_data else []}")

        has_service_role = "service_role" in html_data or "service_role" in ls_data
        print(f"Service Role Key Exposed in DOM/Storage: {has_service_role}")

        print("\n--- NETWORK & CONSOLE SUMMARY ---")
        print(f"Total Network Requests Captured: {len(network_requests)}")
        print(f"Supabase Requests Captured: {len(supabase_requests)}")
        for sr in supabase_requests:
            print(f" - Supabase URL: {sr['url'].split('?')[0]} | Status: {sr['status']}")
        print(f"Failed Requests (>=400): {len(failed_requests)}")
        print(f"Console Messages Captured: {len(console_logs)}")

asyncio.run(run_e2e_suite())
proc.terminate()
