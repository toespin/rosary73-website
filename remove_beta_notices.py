#!/usr/bin/env python3
"""
remove_beta_notices.py

Removes outdated beta notices from the Rosary73 website now that v1.1.2 is live
on the iOS App Store. Replaces "App coming soon" language with "Now available on
iOS" + a QR code linking directly to the App Store listing.

Run from the repo root:
    python3 remove_beta_notices.py

What it does:
1. members.html
   - Removes the "Beta Testing Mode" modal (CSS + HTML + JS triggers)
   - Updates "Available Soon!" -> "Now available on iOS! Android coming soon."
2. index.html
   - Removes sessionStorage showBetaModal trigger
   - Replaces "App coming soon" footer line with QR code download CTA
3. Inventories any remaining beta/testflight references across all HTML files
   (the USD_PAYMENTS_DISABLED toggle is intentionally left alone)

Safety: writes .bak files next to originals before modifying. Idempotent --
safe to re-run; will report no changes on a second pass.

Prerequisite: images/rosary73-appstore-qr.svg must exist in the repo (it does).
"""

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def edit_file(path, transform_fn):
    """Apply transform_fn(content) -> new_content. Writes .bak backup first."""
    path = Path(path)
    if not path.exists():
        print(f"  WARN: Skipping {path.name}: file not found")
        return False
    original = path.read_text(encoding='utf-8')
    new = transform_fn(original)
    if new == original:
        print(f"  INFO: No changes needed in {path.name}")
        return False
    bak = path.with_suffix(path.suffix + '.bak')
    shutil.copy(path, bak)
    path.write_text(new, encoding='utf-8')
    delta = len(new) - len(original)
    print(f"  OK: Updated {path.name} ({delta:+d} bytes; backup: {bak.name})")
    return True


# ============================================================================
# members.html -- remove beta modal
# ============================================================================

def clean_members_html(content):
    changes = []

    # 1. Remove beta modal CSS block
    css_pattern = re.compile(
        r'\n    /\* =+\n'
        r'       BETA INFO MODAL\n'
        r'    =+ \*/\n'
        r'    \.beta-modal-overlay \{.*?'
        r'    @media \(max-width: 480px\) \{ \.beta-modal-card \{ padding: 32px 22px 26px; \} \}\n',
        re.DOTALL
    )
    new, n = css_pattern.subn('\n', content)
    if n: changes.append(f"removed {n} CSS block(s)")
    content = new

    # 2. Remove beta modal HTML block
    html_pattern = re.compile(
        r'\n    <!-- Beta Info Modal -->\n'
        r'    <div class="beta-modal-overlay" id="beta-modal-overlay" style="display:none;">\n'
        r'      <div class="beta-modal-card">\n'
        r'        <button class="beta-modal-close".*?</button>\n'
        r'        <div class="beta-modal-badge">.*?</div>\n'
        r'        <div class="beta-modal-icon">.*?</div>\n'
        r"        <h3>We're in Beta Testing Mode</h3>\n"
        r'        <div class="beta-modal-body">\n'
        r'.*?'
        r'        </div>\n'
        r'      </div>\n'
        r'    </div>\n',
        re.DOTALL
    )
    new, n = html_pattern.subn('\n', content)
    if n: changes.append(f"removed {n} HTML modal block(s)")
    content = new

    # 3. Remove JS: showBetaModal() + closeBetaModal() + click handler
    js_pattern = re.compile(
        r'\n    // =+\n'
        r'    // BETA INFO MODAL\n'
        r'    // =+\n'
        r'    function showBetaModal\(\) \{[^}]+\}\n'
        r'    function closeBetaModal\(\) \{[^}]+\}\n'
        r'    // Close on overlay click\n'
        r"    document\.addEventListener\('click', function\(e\) \{[^}]+\}\);\n",
        re.DOTALL
    )
    new, n = js_pattern.subn('\n', content)
    if n: changes.append(f"removed {n} JS function block(s)")
    content = new

    # 4. Remove the DOMContentLoaded trigger block
    dom_pattern = re.compile(
        r'\n        // Show beta modal if flagged from login/signup redirect\n'
        r"        if \(sessionStorage\.getItem\('showBetaModal'\) === '1'\) \{\n"
        r"          sessionStorage\.removeItem\('showBetaModal'\);\n"
        r'          setTimeout\(showBetaModal, 500\);\n'
        r'        \}\n'
    )
    new, n = dom_pattern.subn('\n', content)
    if n: changes.append(f"removed {n} DOMContentLoaded trigger(s)")
    content = new

    # 5. Remove showBetaModal() call inside setupLoginForm
    login_trigger = re.compile(
        r"\n          showToast\('Welcome back, ' \+ result\.username \+ '!', 'success'\);\n"
        r'          showBetaModal\(\);\n'
    )
    new, n = login_trigger.subn(
        "\n          showToast('Welcome back, ' + result.username + '!', 'success');\n",
        content
    )
    if n: changes.append(f"removed {n} login-form trigger(s)")
    content = new

    # 6. Update "Available Soon!" in My Groups section
    old = '<p style="color: var(--gold); font-size: 0.85rem; margin-top: 12px; font-weight: 600;">\U0001f4f1 Available Soon!</p>'
    new = '<p style="color: var(--gold); font-size: 0.85rem; margin-top: 12px; font-weight: 600;">\U0001f4f1 Now available on iOS! Android coming soon.</p>'
    if old in content:
        content = content.replace(old, new)
        changes.append("updated 'Available Soon!' to current launch status")

    if changes:
        for c in changes:
            print(f"     - {c}")
    return content


# ============================================================================
# index.html -- remove beta trigger + replace footer with QR download CTA
# ============================================================================

def clean_index_html(content):
    changes = []

    # 1. Remove sessionStorage.setItem('showBetaModal', '1'); line
    trigger_pattern = re.compile(
        r"\n                sessionStorage\.setItem\('showBetaModal', '1'\);\n"
    )
    new, n = trigger_pattern.subn('\n', content)
    if n: changes.append(f"removed {n} showBetaModal trigger(s)")
    content = new

    # 2. Replace the testflight-note line with QR code download section
    old_line = '<p class="testflight-note">App coming soon to iOS and Android!</p>'
    new_block = (
        '<div class="app-download-cta" style="margin-top:32px;display:flex;flex-direction:column;align-items:center;gap:16px;">\n'
        '                  <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center;">\n'
        '                    <a href="https://apps.apple.com/app/id6753041495" target="_blank" rel="noopener" style="display:inline-block;background:#fff;padding:12px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.25);text-decoration:none;">\n'
        '                      <img src="images/rosary73-appstore-qr.svg" alt="Scan to download Rosary73 on the App Store" style="width:140px;height:140px;display:block;" />\n'
        '                    </a>\n'
        '                    <div style="text-align:left;color:#fff;max-width:280px;">\n'
        '                      <p style="font-size:1.1rem;font-weight:600;margin:0 0 8px 0;color:#FFD700;">\U0001f4f1 Available now on iOS!</p>\n'
        '                      <p style="font-size:0.95rem;margin:0 0 4px 0;opacity:0.9;">Scan the QR, or search "Rosary73" on the App Store.</p>\n'
        '                      <p style="font-size:0.85rem;margin:12px 0 0 0;opacity:0.7;font-style:italic;">Android coming soon.</p>\n'
        '                    </div>\n'
        '                  </div>\n'
        '                </div>'
    )
    if old_line in content:
        content = content.replace(old_line, new_block)
        changes.append("replaced 'App coming soon' with QR code download CTA")

    if changes:
        for c in changes:
            print(f"     - {c}")
    return content


# ============================================================================
# Inventory: scan for remaining beta references across all HTML files
# ============================================================================

def inventory_beta_references():
    print("\n=== INVENTORY: Remaining 'beta' / 'TestFlight' references ===\n")
    pat = re.compile(r'(beta|testflight)', re.IGNORECASE)
    html_files = sorted(ROOT.glob('*.html'))
    found_any = False
    for hf in html_files:
        if hf.name.endswith('.bak'):
            continue
        with hf.open('r', encoding='utf-8') as f:
            for i, line in enumerate(f, 1):
                if pat.search(line):
                    s = line.strip()
                    if len(s) > 180:
                        s = s[:180] + '...'
                    print(f"  {hf.name}:{i}  {s}")
                    found_any = True
    if not found_any:
        print("  All clear! No more beta references found.")
    else:
        print("\n  Note: 'USD_PAYMENTS_DISABLED' toggle (currently false) is intentional --")
        print("  leave it in case you ever need to disable USD payments temporarily.")
        print("  Other matches may be in subscribe.html and worth a manual look.")


# ============================================================================
# Main
# ============================================================================

def main():
    print("Rosary73 Website: Removing Beta Notices\n")
    print("members.html:")
    edit_file(ROOT / 'members.html', clean_members_html)
    print("\nindex.html:")
    edit_file(ROOT / 'index.html', clean_index_html)
    inventory_beta_references()
    print("\nDone!\n")
    print("Next steps:")
    print("  1. Review:   git diff")
    print("  2. Test:     open the site locally and verify it looks right")
    print("  3. Commit:   git add -A && git commit -m 'remove beta notices, add App Store QR' && git push")
    print("  4. Cleanup:  rm *.bak  (after you are satisfied)")


if __name__ == '__main__':
    main()
