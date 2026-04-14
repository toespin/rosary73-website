#!/usr/bin/env python3
"""
PayPal Integration Edit Script for subscribe.html
Run: python3 edit_subscribe_paypal.py
Then: git add subscribe.html && git commit -m "feat: integrate PayPal for USD users" && git push origin main
"""

import sys
import os

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
        print(f"  ERROR: '{label}' — find string NOT FOUND. Skipping.")
        return content, False
    if count > 1:
        print(f"  WARNING: '{label}' — found {count} matches (expected 1). Replacing first only.")
        return content.replace(find, replace, 1), True
    content = content.replace(find, replace)
    print(f"  OK: '{label}' applied successfully.")
    return content, True

def main():
    if not os.path.exists(FILE):
        print(f"Error: {FILE} not found. Run this script from ~/rosary73-website/")
        sys.exit(1)

    content = read_file()
    original = content
    edits_applied = 0
    total_edits = 10

    print(f"\nPayPal Integration Editor for {FILE}")
    print(f"File size: {len(content)} bytes")
    print(f"Applying {total_edits} edits...\n")

    # ── Edit 1: Flip USD_PAYMENTS_DISABLED ──
    content, ok = safe_replace(content,
        'var USD_PAYMENTS_DISABLED = true;',
        'var USD_PAYMENTS_DISABLED = false;',
        'Edit 1: USD_PAYMENTS_DISABLED = false')
    if ok: edits_applied += 1

    # ── Edit 2: Subscribe tab — xendit-card-section + PayPal container ──
    content, ok = safe_replace(content,
        '''          <div class="payment-group">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','sub')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <button class="action-btn" id="subscribe-btn"''',

        '''          <div class="payment-group xendit-card-section">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','sub')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <div id="paypal-subscribe-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
            <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
          </div>
          <button class="action-btn" id="subscribe-btn"''',
        'Edit 2: Subscribe tab PayPal container')
    if ok: edits_applied += 1

    # ── Edit 3: Upgrade tab ──
    content, ok = safe_replace(content,
        '''          <div class="payment-group">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','upgrade')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <button class="action-btn" id="upgrade-btn"''',

        '''          <div class="payment-group xendit-card-section">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','upgrade')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <div id="paypal-upgrade-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
            <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
          </div>
          <button class="action-btn" id="upgrade-btn"''',
        'Edit 3: Upgrade tab PayPal container')
    if ok: edits_applied += 1

    # ── Edit 4: Gift tab ──
    content, ok = safe_replace(content,
        '''          <div class="payment-group">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','gift')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <button class="action-btn" id="gift-btn"''',

        '''          <div class="payment-group xendit-card-section">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','gift')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <div id="paypal-gift-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
            <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
          </div>
          <button class="action-btn" id="gift-btn"''',
        'Edit 4: Gift tab PayPal container')
    if ok: edits_applied += 1

    # ── Edit 5: Donate tab ──
    content, ok = safe_replace(content,
        '''          <div class="payment-group">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','donate')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <button class="action-btn" id="donate-btn"''',

        '''          <div class="payment-group xendit-card-section">
            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <button class="payment-btn" data-method="card" onclick="selectPayment('card','donate')"><img src="images/creditcardlogos.png" class="pay-logo" alt="Credit/Debit Card"></button>
            </div>
          </div>
          <div id="paypal-donate-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
            <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
          </div>
          <button class="action-btn" id="donate-btn"''',
        'Edit 5: Donate tab PayPal container')
    if ok: edits_applied += 1

    # ── Edit 6: Add PayPal init in showMainContent() ──
    content, ok = safe_replace(content,
        '''      applyUsdBetaRestrictions();
    }

    function checkPerpetualStatus()''',

        '''      applyUsdBetaRestrictions();

      // Initialize PayPal for USD users
      if (window.Rosary73PayPal) {
        Rosary73PayPal.init(currentUser);
        if (Rosary73PayPal.isUSDUser()) {
          // Hide Xendit action buttons — PayPal buttons are the CTA for USD
          ['subscribe-btn', 'upgrade-btn', 'gift-btn', 'donate-btn'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.style.display = 'none';
          });
        }
      }
    }

    function checkPerpetualStatus()''',
        'Edit 6: PayPal init in showMainContent')
    if ok: edits_applied += 1

    # ── Edit 7: Update processPayment for PayPal ──
    content, ok = safe_replace(content,
        '''      if (currentRegion !== 'PH') {
        pendingCardType = type;
        document.getElementById('beta-modal').classList.remove('hidden');
        return;
      }
      await processPaymentDirect(type);''',

        '''      if (currentRegion !== 'PH') {
        // If PayPal is handling USD payments, don't show beta modal
        if (window.Rosary73PayPal && Rosary73PayPal.isUSDUser()) {
          console.log('USD payment handled by PayPal buttons');
          return;
        }
        pendingCardType = type;
        document.getElementById('beta-modal').classList.remove('hidden');
        return;
      }
      await processPaymentDirect(type);''',
        'Edit 7: processPayment PayPal check')
    if ok: edits_applied += 1

    # ── Edit 8: Add PayPal success overlay before footer ──
    content, ok = safe_replace(content,
        '  <footer class="footer">',

        '''  <!-- PayPal Success Overlay -->
  <div id="paypal-success-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:40px; border-radius:20px; text-align:center; max-width:400px; border: 2px solid rgba(212,175,55,0.3);">
      <div style="font-size:48px; margin-bottom:16px;">\u2705</div>
      <p id="paypal-success-message" style="font-size:18px; font-weight:600; color:#d4af37;">Payment successful!</p>
      <p style="color:rgba(255,255,255,0.6); margin-top:10px; font-size:0.9rem;">Redirecting...</p>
    </div>
  </div>

  <footer class="footer">''',
        'Edit 8: PayPal success overlay')
    if ok: edits_applied += 1

    # ── Edit 9: Update footer text ──
    content, ok = safe_replace(content,
        '<p>Secure payments powered by Xendit</p>',
        '<p>Secure payments powered by Xendit &amp; PayPal</p>',
        'Edit 9: Footer text update')
    if ok: edits_applied += 1

    # ── Edit 10: Add PayPal SDK + script before </body> ──
    content, ok = safe_replace(content,
        '</body>\n</html>',

        '''  <!-- PayPal SDK (activates only for USD users via paypal-integration.js) -->
  <script src="https://www.paypal.com/sdk/js?client-id=Aa4mUqIMHbxTlWAUyte1e-A3d7eLQDNjgJY1iGI7wlnDVl13gbeX6T2-1VVyuwBqQvdYf7MTfK7Ab7Tn&vault=true&intent=subscription&currency=USD"></script>
  <script src="paypal-integration.js"></script>
</body>
</html>''',
        'Edit 10: PayPal SDK script tags')
    if ok: edits_applied += 1

    # ── Results ──
    print(f"\n{'='*50}")
    print(f"Results: {edits_applied}/{total_edits} edits applied")
    print(f"{'='*50}")

    if edits_applied == 0:
        print("No edits applied. File unchanged.")
        sys.exit(1)

    if content == original:
        print("WARNING: Content unchanged despite edits reported. Check output.")
        sys.exit(1)

    # Write the file
    write_file(content)
    print(f"\n{FILE} updated ({len(content)} bytes)")

    # Verification
    print("\nVerification:")
    checks = [
        ('USD_PAYMENTS_DISABLED = false', 1),
        ('xendit-card-section', 4),
        ('paypal-usd-container', 4),
        ('paypal-success-overlay', 1),
        ('paypal-integration.js', 1),
        ('Rosary73PayPal.init', 1),
        ('Xendit &amp; PayPal', 1),
    ]
    all_pass = True
    for search, expected in checks:
        found = content.count(search)
        status = 'PASS' if found == expected else 'FAIL'
        if status == 'FAIL': all_pass = False
        print(f"  {status}: '{search}' — found {found}, expected {expected}")

    if all_pass:
        print(f"\nAll checks passed! Now run:")
        print(f"  git add subscribe.html")
        print(f'  git commit -m "feat: integrate PayPal for USD users in subscribe.html"')
        print(f"  git push origin main")
    else:
        print(f"\nSome checks failed. Review the file before committing.")

    if edits_applied < total_edits:
        print(f"\nWARNING: {total_edits - edits_applied} edit(s) failed. Check errors above.")

if __name__ == '__main__':
    main()
