#!/usr/bin/env python3
"""
Adds email verification banner script tag to members.html and subscribe.html.
Run: python3 add_verification_banner.py
"""
import sys, os

FILES = ['members.html', 'subscribe.html']
SCRIPT_TAG = '  <script src="email-verification-banner.js"></script>'

def process(filename):
    if not os.path.exists(filename):
        print(f"  SKIP: {filename} not found")
        return False

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'email-verification-banner.js' in content:
        print(f"  SKIP: {filename} — banner script already included")
        return False

    # Insert right before </body>
    marker = '</body>'
    if marker not in content:
        print(f"  FAIL: {filename} — no </body> tag found")
        return False

    new_content = content.replace(marker, SCRIPT_TAG + '\n' + marker, 1)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"  OK: {filename} — banner script added before </body>")
    return True

def main():
    print("\nAdding email verification banner to members.html and subscribe.html\n")
    changed = []
    for f in FILES:
        if process(f):
            changed.append(f)

    if not changed:
        print("\nNo files changed.")
        return

    print(f"\n{'='*50}")
    print(f"Modified {len(changed)} file(s): {', '.join(changed)}")
    print(f"{'='*50}")
    print(f"\nNow run:")
    print(f"  git add " + ' '.join(changed))
    print(f'  git commit -m "feat: include email verification banner in members and subscribe pages"')
    print(f"  git push origin main")

if __name__ == '__main__':
    main()
