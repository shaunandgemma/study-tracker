import json
import re

bank = json.load(open('data/SAA-C03-question-bank-upgraded-250.json', 'r', encoding='utf-8'))
by_id = {q['id']: q for q in bank}

q = by_id['q-saa-1']

# Simulated shuffle result:
# Original options:
# Index 0 (A): "Allow TCP port 3306 ... CIDR blocks"
# Index 1 (B): "Allow TCP port 3306 ... web-tier security group" (Correct)
# Index 2 (C): "Add a network ACL rule ..."
# Index 3 (D): "Create an automation function ..."

# Suppose after shuffle, new order is [2, 0, 1, 3]:
# Displayed Index 0 (A) = Original Index 2 (C)
# Displayed Index 1 (B) = Original Index 0 (A)
# Displayed Index 2 (C) = Original Index 1 (B) -> Correct!
# Displayed Index 3 (D) = Original Index 3 (D)

orig_to_new = {0: 1, 1: 2, 2: 0, 3: 3}
letter_map = {0: 'A', 1: 'B', 2: 'C', 3: 'D'}

def remap_explanation(exp_text, orig_to_new):
    # Step 1: Replace original letters with unique placeholders __OPT_REF_{origIdx}__
    
    # Match bullet lines like "A. " or "\nB. "
    def replace_bullet(match):
        orig_let = match.group(1).upper()
        orig_idx = ord(orig_let) - 65
        return f"\n__OPT_BULLET_{orig_idx}__ "

    # Replace leading bullets
    temp = re.sub(r'^\s*([A-D])\.\s+', replace_bullet, exp_text, flags=re.M)
    
    # Match inline Option A / Answer B / Choice C / Options A and C
    def replace_inline(match):
        prefix = match.group(1) # e.g. "Option", "Answer", "Choice"
        orig_let = match.group(2).upper()
        orig_idx = ord(orig_let) - 65
        return f"{prefix} __OPT_REF_{orig_idx}__"

    temp = re.sub(r'\b(Option|Answer|Choice|Options|Answers)\s+([A-D])\b', replace_inline, temp, flags=re.IGNORECASE)

    # Step 2: Replace placeholders with newly displayed letters
    for orig_idx in range(4):
        new_idx = orig_to_new.get(orig_idx, orig_idx)
        new_let = letter_map[new_idx]
        
        temp = temp.replace(f"__OPT_BULLET_{orig_idx}__", f"{new_let}.")
        temp = temp.replace(f"__OPT_REF_{orig_idx}__", new_let)
        
    return temp

print("=== ORIGINAL EXPLANATION ===")
print(q['explanation'])

print("\n=== REMAPPED EXPLANATION AFTER SHUFFLE (Original B -> Displayed C) ===")
print(remap_explanation(q['explanation'], orig_to_new))
