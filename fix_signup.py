#!/usr/bin/env python3
"""
Fix script for signup.html — simplify signup flow.
Run: python3 fix_signup.py
"""
import sys, os

FILE = 'signup.html'

def read_file():
    with open(FILE, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(content):
    with open(FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def safe_replace(content, find, replace, label):
    count = content.count(find)
    if count == 0:
        print(f"  SKIP: '{label}' — not found")
        return content, False
    if count > 1:
        print(f"  WARN: '{label}' — {count} matches, replacing first only")
        return content.replace(find, replace, 1), True
    print(f"  OK: '{label}'")
    return content.replace(find, replace), True

def main():
    if not os.path.exists(FILE):
        print(f"Error: {FILE} not found. Run from ~/rosary73-website/")
        sys.exit(1)

    content = read_file()
    fixes = 0

    print(f"\nSimplifying {FILE}\n")

    # ── Fix 1: Remove the GCash/Maya banner ──
    content, ok = safe_replace(content,
        '''        <div class="web-exclusive">
          <span class="icon">&#127760;</span>
          <div class="text">
            <strong>Pay with GCash, Maya &amp; more!</strong>
            <small>eWallet payments available only on website</small>
          </div>
        </div>

        <div id="error-message"''',

        '        <div id="error-message"',
        'Fix 1: Remove GCash/Maya banner')
    if ok: fixes += 1

    # ── Fix 2: Replace bottom links with "Login here" ──
    content, ok = safe_replace(content,
        '''        <div class="divider"><span>Already have an account?</span></div>

        <div class="form-links">
          <p><a href="subscribe.html">Subscribe</a> to unlock premium features</p>
          <p style="margin-top: 10px;">Or <a href="index.html#download">download the app</a> to login</p>
        </div>''',

        '''        <div class="divider"><span>Already have an account?</span></div>

        <div class="form-links">
          <p><a href="members.html">Login here</a></p>
        </div>''',
        'Fix 2: Replace bottom links with Login here')
    if ok: fixes += 1

    # ── Fix 3: Redirect to members.html after account creation ──
    content, ok = safe_replace(content,
        "setTimeout(function() { window.location.href = 'verify-email.html?email=' + encodeURIComponent(email); }, 4000);",
        "setTimeout(function() { window.location.href = 'members.html'; }, 4000);",
        'Fix 3: Redirect to members.html after signup')
    if ok: fixes += 1

    # ── Write ──
    write_file(content)
    print(f"\n{'='*50}")
    print(f"Applied {fixes}/3 fix(es)")
    print(f"{'='*50}")

    # Verify
    print("\nVerification:")
    if 'web-exclusive' not in content:
        print("  PASS: GCash/Maya banner removed")
    else:
        print("  FAIL: GCash/Maya banner still present")

    if 'Login here</a></p>' in content:
        print("  PASS: Login here link added")
    else:
        print("  FAIL: Login here link not found")

    if "members.html'; }, 4000)" in content:
        print("  PASS: Redirect goes to members.html")
    else:
        print("  FAIL: Redirect not updated")

    if 'subscribe.html">Subscribe</a> to unlock' not in content:
        print("  PASS: Old subscribe link removed")
    else:
        print("  FAIL: Old subscribe link still present")

    print(f"\nNow run:")
    print(f"  git add signup.html")
    print(f'  git commit -m "fix: simplify signup page — remove payment banner, redirect to members dashboard"')
    print(f"  git push origin main")

if __name__ == '__main__':
    main()
