import os
import json
import urllib.request

env_dict = {}
env_path = '.env.local'
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env_dict[k.strip()] = v.strip().strip('"').strip("'")

url = env_dict.get('VITE_SUPABASE_URL') or env_dict.get('SUPABASE_URL')
key = env_dict.get('VITE_SUPABASE_PUBLISHABLE_KEY')

print("=== SUPABASE READ-ONLY AUDIT ===")
print("Supabase URL Target:", url)
project_ref = url.split('://')[1].split('.')[0] if url else 'unknown'
print("Project Reference:", project_ref)

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Range': '0-999'
}

def query_table(table, select='id'):
    req_url = f"{url}/rest/v1/{table}?select={select}"
    req = urllib.request.Request(req_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return resp.status, data
    except urllib.error.HTTPError as e:
        return e.code, e.reason

# 1. Query exam_questions
status_q, live_q = query_table('exam_questions', 'id,exam_code,question_type')
print(f"exam_questions read status: {status_q}, count returned: {len(live_q) if isinstance(live_q, list) else live_q}")

# 2. Query question_topics
status_t, live_t = query_table('question_topics', 'question_id,topic_id')
print(f"question_topics read status: {status_t}, count returned: {len(live_t) if isinstance(live_t, list) else live_t}")

# 3. Query hands_on_tasks
status_h, live_h = query_table('hands_on_tasks', 'id,slug')
print(f"hands_on_tasks read status: {status_h}, count returned: {len(live_h) if isinstance(live_h, list) else live_h}")

# 4. Compare live_q vs canonical bank
local_bank = json.load(open('data/SAA-C03-question-bank-upgraded-250.json', 'r', encoding='utf-8'))
local_ids = set(q['id'] for q in local_bank)
if isinstance(live_q, list):
    live_ids = set(q['id'] for q in live_q)
    print(f"\nCanonical Local Question IDs: {len(local_ids)}")
    print(f"Live Database Question IDs: {len(live_ids)}")
    print(f"Missing in Live DB: {len(local_ids - live_ids)}")
    print(f"Extra in Live DB: {len(live_ids - local_ids)}")

if isinstance(live_h, list):
    local_baseline = json.load(open('migration_work/hands_on_tasks/checklist-baseline.json', 'r', encoding='utf-8'))
    if isinstance(local_baseline, list):
        local_task_ids = set(t['id'] for t in local_baseline)
    elif isinstance(local_baseline, dict) and 'tasks' in local_baseline:
        tasks_obj = local_baseline['tasks']
        if isinstance(tasks_obj, list):
            local_task_ids = set(t['id'] for t in tasks_obj)
        elif isinstance(tasks_obj, dict):
            local_task_ids = set(tasks_obj.keys())
    live_task_ids = set(t['id'] for t in live_h)
    print(f"\nCanonical Local Task IDs: {len(local_task_ids)}")
    print(f"Live Database Task IDs: {len(live_task_ids)}")
    print(f"Missing Tasks in Live DB: {len(local_task_ids - live_task_ids)}")
    print(f"Extra Tasks in Live DB: {len(live_task_ids - local_task_ids)}")
