#!/usr/bin/env python3
"""
Fix script for subscribe.html PayPal integration bugs.
Run: python3 fix_subscribe_paypal.py
"""
import sys, os

FILE = 'subscribe.html'

def read_file():
    with open(FILE, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(content):
    with open(FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def safe_replace(content, find, replace, label):
    count = content.count(find)
    if count == 0:
        print(f"  SKIP: '{label}' — not found (may already be fixed)")
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

    print(f"\nFixing PayPal integration bugs in {FILE}\n")

    # ── Fix 1: Normalize regionCode ──
    # verifyUserFromGate sets currentRegion from regionCode directly.
    # Some users have "OTHERS" instead of "OTHER". Normalize to PH or OTHER.
    content, ok = safe_replace(content,
        "currentRegion = result.regionCode || 'OTHER';",
        "currentRegion = (result.regionCode === 'PH') ? 'PH' : 'OTHER';",
        'Fix 1a: Normalize region in verifyUserFromGate')
    if ok: fixes += 1

    # Also fix the sessionStorage restore path in init()
    content, ok = safe_replace(content,
        "currentRegion = currentUser.regionCode || 'OTHER';",
        "currentRegion = (currentUser.regionCode === 'PH') ? 'PH' : 'OTHER';",
        'Fix 1b: Normalize region in init')
    if ok: fixes += 1

    # ── Fix 2: Fix PayPal SDK URL ──
    # Remove intent=subscription so Gift/Donate tabs can use createOrder
    content, ok = safe_replace(content,
        '&vault=true&intent=subscription&currency=USD',
        '&vault=true&currency=USD',
        'Fix 2: Remove intent=subscription from PayPal SDK URL')
    if ok: fixes += 1

    # ── Fix 3: Ensure PayPal init runs on page load ──
    # Check if Rosary73PayPal.init is already present
    if 'Rosary73PayPal.init' not in content:
        print("  ERROR: Rosary73PayPal.init NOT found in file! Edit 6 may not have been applied.")
        print("  Adding it now...")

        content, ok = safe_replace(content,
            "      applyUsdBetaRestrictions();\n    }",
            """      applyUsdBetaRestrictions();

      // Initialize PayPal for USD users
      if (window.Rosary73PayPal) {
        Rosary73PayPal.init(currentUser);
        if (Rosary73PayPal.isUSDUser()) {
          ['subscribe-btn', 'upgrade-btn', 'gift-btn', 'donate-btn'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.style.display = 'none';
          });
        }
      }
    }""",
            'Fix 3: Add PayPal init to showMainContent')
        if ok: fixes += 1
    else:
        # PayPal init exists but may not be running because showMainContent
        # calls applyUsdBetaRestrictions which greys out everything for USD.
        # The init needs to run AFTER that function, which it does.
        # But applyUsdBetaRestrictions may be interfering because regionCode was wrong.
        # Fix 1 should resolve this since it normalizes the region.
        print("  OK: Rosary73PayPal.init already present in file")

    # ── Fix 4: Prevent applyUsdBetaRestrictions from blocking when PayPal is active ──
    # The old function checks USD_PAYMENTS_DISABLED which is now false,
    # so it should return early. But let's make sure.
    if content.count('USD_PAYMENTS_DISABLED = false') > 0:
        print("  OK: USD_PAYMENTS_DISABLED is already false")
    else:
        content, ok = safe_replace(content,
            'var USD_PAYMENTS_DISABLED = true;',
            'var USD_PAYMENTS_DISABLED = false;',
            'Fix 4: Set USD_PAYMENTS_DISABLED = false')
        if ok: fixes += 1

    # ── Write ──
    write_file(content)
    print(f"\n{'='*50}")
    print(f"Applied {fixes} fix(es)")
    print(f"{'='*50}")

    # Verify
    print("\nVerification:")
    checks = [
        ("(currentUser.regionCode === 'PH') ? 'PH' : 'OTHER'", 'Region normalization'),
        ("(result.regionCode === 'PH') ? 'PH' : 'OTHER'", 'Region normalization (login)'),
        ('vault=true&currency=USD', 'PayPal SDK URL (no intent)'),
        ('Rosary73PayPal.init', 'PayPal init present'),
    ]
    for search, label in checks:
        found = content.count(search)
        status = 'PASS' if found >= 1 else 'FAIL'
        print(f"  {status}: {label} (found {found}x)")

    # Make sure intent=subscription is gone
    if 'intent=subscription' in content:
        print("  FAIL: intent=subscription still in SDK URL!")
    else:
        print("  PASS: intent=subscription removed from SDK URL")

    print(f"\nNow run:")
    print(f"  git add subscribe.html")
    print(f'  git commit -m "fix: normalize regionCode, remove intent=subscription, ensure PayPal init runs"')
    print(f"  git push origin main")

if __name__ == '__main__':
    main()
