import os
import sys
import shutil
import hashlib

moves = [
    # 4 Reusable verification tools
    ("scripts/cdp_e2e_final.py", "migration_work/verification-tools/cdp_e2e_final.py"),
    ("scripts/verify_supabase_live.py", "migration_work/verification-tools/verify_supabase_live.py"),
    ("scripts/verify_rls.py", "migration_work/verification-tools/verify_rls.py"),
    ("scripts/verify_edge_functions.py", "migration_work/verification-tools/verify_edge_functions.py"),
    
    # 4 Superseded development scripts
    ("scripts/cdp_runner.py", "migration_work/verification-tools/archive/cdp_runner.py"),
    ("scripts/cdp_e2e_full_suite.py", "migration_work/verification-tools/archive/cdp_e2e_full_suite.py"),
    ("scripts/run_cdp_e2e.py", "migration_work/verification-tools/archive/run_cdp_e2e.py"),
    ("scripts/run_final_workflows.py", "migration_work/verification-tools/archive/run_final_workflows.py")
]

print("==================================================")
print("   EXECUTING VERIFICATION TOOLS ORGANIZATION")
print("==================================================")

os.makedirs("migration_work/verification-tools/archive", exist_ok=True)

def calc_hash(fpath):
    return hashlib.sha256(open(fpath, "rb").read()).hexdigest()

results = []

for idx, (src, dest) in enumerate(moves, 1):
    src_abs = os.path.abspath(src)
    dest_abs = os.path.abspath(dest)
    
    if not os.path.exists(src_abs):
        print(f"CRITICAL ERROR: Source missing: {src}")
        sys.exit(1)
        
    if os.path.exists(dest_abs):
        print(f"CRITICAL ERROR: Destination already exists: {dest}")
        sys.exit(1)
        
    pre_hash = calc_hash(src_abs)
    
    # Execute atomic move
    shutil.move(src_abs, dest_abs)
    
    if os.path.exists(src_abs):
        print(f"CRITICAL ERROR: Source still exists after move: {src}")
        sys.exit(1)
        
    if not os.path.exists(dest_abs):
        print(f"CRITICAL ERROR: Destination missing after move: {dest}")
        sys.exit(1)
        
    post_hash = calc_hash(dest_abs)
    
    if pre_hash != post_hash:
        print(f"CRITICAL ERROR: Hash mismatch for {src}! Pre: {pre_hash}, Post: {post_hash}")
        sys.exit(1)
        
    print(f"[{idx}/8] OK Moved: {src} -> {dest} | Hash: {post_hash[:16]}... (MATCH)")
    results.append({
        "src": src,
        "dest": dest,
        "hash": post_hash,
        "status": "MOVED & VERIFIED"
    })

print("\nOK All 8 verification scripts moved and hash-verified 100% cleanly!")
