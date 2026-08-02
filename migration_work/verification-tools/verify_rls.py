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

print("=== SUPABASE RLS SECURITY TEST ===")
headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

# Attempt unauthenticated INSERT into exam_questions
payload = json.dumps([{
    'id': 'qa-e2e-test-unauthorized-insert-999',
    'exam_code': 'aws-saa-c03',
    'question_type': 'single',
    'question_text': 'Unauthorized RLS test prompt',
    'option_a': 'A', 'option_b': 'B', 'option_c': 'C', 'option_d': 'D',
    'correct_answer': 0
}]).encode('utf-8')

req = urllib.request.Request(f"{url}/rest/v1/exam_questions", data=payload, headers=headers, method='POST')
try:
    with urllib.request.urlopen(req) as resp:
        print("UNEXPECTED SUCCESS: RLS allowed write! Status:", resp.status)
except urllib.error.HTTPError as e:
    print(f"RLS ENFORCED (Expected Failure): HTTP {e.code} {e.reason}")
    body = e.read().decode('utf-8')
    print("Response body:", body)
