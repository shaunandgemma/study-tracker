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

print("=== EDGE FUNCTION VERIFICATION ===")
headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

for func_name in ['aws-test-connection', 'aws-validate-task']:
    func_url = f"{url}/functions/v1/{func_name}"
    payload = json.dumps({'test': True}).encode('utf-8')
    req = urllib.request.Request(func_url, data=payload, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"{func_name}: HTTP {resp.status} - Response: {data}")
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"{func_name}: HTTP {e.code} {e.reason} - Response: {body}")
