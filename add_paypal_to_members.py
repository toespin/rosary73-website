#!/usr/bin/env python3
"""
Integrates PayPal into members.html for USD users.

Applies 7 targeted edits:
1. Flips USD_PAYMENTS_DISABLED to false
2. Wraps Subscribe section's Credit/Debit Card in xendit-card-section + adds PayPal container
3. Same for Gift section
4. Same for Donate section
5. Adds PayPal init in updateUI()
6. Adds PayPal success overlay before footer
7. Adds PayPal SDK + integration script before </body>

Run: python3 add_paypal_to_members.py
"""
import sys, os

FILE = 'members.html'

def read_file():
    with open(FILE, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(content):
    with open(FILE, 'w', encoding='utf-8') as f:
        f.write(content)

def safe_replace(content, find, replace, label):
    count = content.count(find)
    if count == 0:
        print(f"  SKIP: '{label}' — not found (may already be applied)")
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
    total = 7

    print(f"\nAdding PayPal to {FILE} ({len(content)} bytes)\n")

    # ── Edit 1: Flip USD toggle ──
    content, ok = safe_replace(content,
        'var USD_PAYMENTS_DISABLED = true;',
        'var USD_PAYMENTS_DISABLED = false;',
        'Edit 1: USD_PAYMENTS_DISABLED = false')
    if ok: fixes += 1

    # ── Edit 2: Subscribe section — xendit-card-section + PayPal container ──
    content, ok = safe_replace(content,
        '''              <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
              <div class="payment-methods">
                <div class="payment-method" data-method="card" onclick="selectPaymentMethod('subscribe', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
              </div>
            </div>
            <button class="btn btn-primary btn-block" id="subscribe-btn" onclick="processSubscription()" disabled>Subscribe Now</button>''',

        '''              <div class="xendit-card-section">
                <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
                <div class="payment-methods">
                  <div class="payment-method" data-method="card" onclick="selectPaymentMethod('subscribe', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
                </div>
              </div>
              <div id="paypal-subscribe-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
                <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
              </div>
            </div>
            <button class="btn btn-primary btn-block" id="subscribe-btn" onclick="processSubscription()" disabled>Subscribe Now</button>''',
        'Edit 2: Subscribe section — xendit-card-section + PayPal container')
    if ok: fixes += 1

    # ── Edit 3: Gift section — xendit-card-section + PayPal container ──
    content, ok = safe_replace(content,
        '''              <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
              <div class="payment-methods">
                <div class="payment-method" data-method="card" onclick="selectPaymentMethod('gift', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
              </div>
            </div>
            <button class="btn btn-primary btn-block" id="gift-btn" onclick="processGift()" disabled>\U0001F381 Send Gift</button>''',

        '''              <div class="xendit-card-section">
                <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
                <div class="payment-methods">
                  <div class="payment-method" data-method="card" onclick="selectPaymentMethod('gift', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
                </div>
              </div>
              <div id="paypal-gift-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
                <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
              </div>
            </div>
            <button class="btn btn-primary btn-block" id="gift-btn" onclick="processGift()" disabled>\U0001F381 Send Gift</button>''',
        'Edit 3: Gift section — xendit-card-section + PayPal container')
    if ok: fixes += 1

    # ── Edit 4: Donate section — xendit-card-section + PayPal container ──
    content, ok = safe_replace(content,
        '''            <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
            <div class="payment-methods">
              <div class="payment-method" data-method="card" onclick="selectPaymentMethod('donate', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
            </div>
          </div>
          <button class="btn btn-primary btn-block" id="donate-btn" onclick="processDonation()" disabled>\U0001F49D Donate Now</button>''',

        '''            <div class="xendit-card-section">
              <div class="payment-group-title"><span>Credit/Debit Card</span><span class="all-countries-tag">ALL COUNTRIES</span></div>
              <div class="payment-methods">
                <div class="payment-method" data-method="card" onclick="selectPaymentMethod('donate', 'card')"><div class="payment-method-icon"><img src="images/creditcardlogos.png" alt="Credit/Debit Card"></div></div>
              </div>
            </div>
            <div id="paypal-donate-buttons" class="paypal-usd-container" style="display:none; margin-top: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;">
              <p style="text-align:center; margin-bottom:12px; font-weight:600; color:#d4af37;">Pay with PayPal</p>
            </div>
          </div>
          <button class="btn btn-primary btn-block" id="donate-btn" onclick="processDonation()" disabled>\U0001F49D Donate Now</button>''',
        'Edit 4: Donate section — xendit-card-section + PayPal container')
    if ok: fixes += 1

    # ── Edit 5: PayPal init in updateUI() ──
    content, ok = safe_replace(content,
        '''      updatePricing();
      applyUsdBetaRestrictions();
    }''',

        '''      updatePricing();
      applyUsdBetaRestrictions();

      // Initialize PayPal for USD users (after Xendit setup)
      if (window.Rosary73PayPal) {
        Rosary73PayPal.init(userData);
        if (Rosary73PayPal.isUSDUser()) {
          // Hide Xendit action buttons — PayPal buttons are the CTA for USD
          ['subscribe-btn', 'gift-btn', 'donate-btn'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) btn.style.display = 'none';
          });
        }
      }
    }''',
        'Edit 5: PayPal init in updateUI')
    if ok: fixes += 1

    # ── Edit 6: PayPal success overlay ──
    content, ok = safe_replace(content,
        '  <div class="toast-container" id="toast-container"></div>',

        '''  <!-- PayPal Success Overlay -->
  <div id="paypal-success-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; justify-content:center; align-items:center;">
    <div style="background:linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding:40px; border-radius:20px; text-align:center; max-width:400px; border: 2px solid rgba(212,175,55,0.3);">
      <div style="font-size:48px; margin-bottom:16px;">\u2705</div>
      <p id="paypal-success-message" style="font-size:18px; font-weight:600; color:#d4af37;">Payment successful!</p>
      <p style="color:rgba(255,255,255,0.6); margin-top:10px; font-size:0.9rem;">Redirecting...</p>
    </div>
  </div>

  <div class="toast-container" id="toast-container"></div>''',
        'Edit 6: PayPal success overlay')
    if ok: fixes += 1

    # ── Edit 7: PayPal SDK + integration scripts before </body> ──
    content, ok = safe_replace(content,
        '</body>\n</html>',

        '''  <!-- PayPal SDK (activates only for USD users via paypal-integration.js) -->
  <script src="https://www.paypal.com/sdk/js?client-id=Aa4mUqIMHbxTlWAUyte1e-A3d7eLQDNjgJY1iGI7wlnDVl13gbeX6T2-1VVyuwBqQvdYf7MTfK7Ab7Tn&vault=true&currency=USD"></script>
  <script src="paypal-integration.js"></script>
</body>
</html>''',
        'Edit 7: PayPal SDK + integration scripts')
    if ok: fixes += 1

    # ── Write ──
    write_file(content)
    print(f"\n{'='*50}")
    print(f"Applied {fixes}/{total} edits")
    print(f"{'='*50}")

    # Verify
    print("\nVerification:")
    checks = [
        ('USD_PAYMENTS_DISABLED = false', 1, None),
        ('xendit-card-section', 3, None),
        ('paypal-usd-container', 3, None),
        ('paypal-subscribe-buttons', 1, None),
        ('paypal-gift-buttons', 1, None),
        ('paypal-donate-buttons', 1, None),
        ('paypal-success-overlay', 1, None),
        ('paypal-integration.js', 1, None),
        ('Rosary73PayPal.init(userData)', 1, None),
        ('www.paypal.com/sdk/js', 1, None),
    ]
    all_pass = True
    for search, expected, label in checks:
        found = content.count(search)
        status = 'PASS' if found >= expected else 'FAIL'
        if status == 'FAIL': all_pass = False
        print(f"  {status}: '{search}' — found {found}, expected >= {expected}")

    print()
    if all_pass and fixes == total:
        print("All checks passed! Now run:")
        print("  git add members.html")
        print('  git commit -m "feat: integrate PayPal for USD users in members.html"')
        print("  git push origin main")
    else:
        print(f"Some edits failed or verification failed. Review {FILE} before committing.")

if __name__ == '__main__':
    main()
