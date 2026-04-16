/**
 * Email Verification Banner for Rosary73
 *
 * Auto-injects a verification banner at the top of any page when the
 * logged-in user has not yet verified their email.
 *
 * Usage: <script src="email-verification-banner.js"></script>
 * (Include once in the <body>, anywhere after the sessionStorage user is set.)
 *
 * Features:
 * - Checks verification status via checkEmailVerification Cloud Function
 * - Polls every 30 seconds to auto-dismiss when user verifies
 * - "Verify Now" button → navigates to verify-email.html
 * - "Resend Email" button → calls resendVerificationEmail Cloud Function with cooldown
 * - Safely no-op if no user is logged in
 */
(function() {
    'use strict';

    var FUNCTIONS_URL = 'https://us-central1-rosary--interact-app.cloudfunctions.net';
    var BANNER_ID = 'email-verification-banner';
    var pollInterval = null;
    var resendCooldown = 0;
    var userEmail = '';
    var currentUser = null;

    function getCurrentUser() {
        try {
            var saved = sessionStorage.getItem('rosary73User');
            if (!saved) return null;
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }

    function shouldCheckVerification() {
        currentUser = getCurrentUser();
        if (!currentUser) return false;
        // If user object already reports verified, skip the check
        if (currentUser.emailVerified === true || currentUser.hasValidEmail === true) return false;
        // Need an email to check against
        userEmail = currentUser.email || '';
        if (!userEmail) return false;
        return true;
    }

    async function checkEmailVerified() {
        try {
            var response = await fetch(FUNCTIONS_URL + '/checkEmailVerification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, userId: currentUser.userId })
            });
            var result = await response.json();
            return result.verified === true;
        } catch (e) {
            console.log('Email verification check failed:', e);
            return true; // Fail-open — don't annoy users if the check fails
        }
    }

    function createBanner() {
        // Remove old banner if it exists
        var existing = document.getElementById(BANNER_ID);
        if (existing) existing.remove();

        var banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.style.cssText = [
            'position: sticky',
            'top: 0',
            'left: 0',
            'right: 0',
            'z-index: 10000',
            'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'color: #1a1a2e',
            'padding: 14px 20px',
            'box-shadow: 0 4px 12px rgba(0,0,0,0.2)',
            'font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif',
            'font-size: 0.95rem'
        ].join(';');

        banner.innerHTML = [
            '<div style="max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">',
                '<div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 200px;">',
                    '<span style="font-size: 1.5rem;">\u{1F4E7}</span>',
                    '<div>',
                        '<strong style="font-weight: 700;">Please verify your email</strong>',
                        '<div style="font-size: 0.85rem; opacity: 0.85; margin-top: 2px;">',
                            'Verify your email to subscribe, gift, or donate. Check your inbox at <strong>' + escapeHtml(userEmail) + '</strong>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div style="display: flex; gap: 8px; flex-wrap: wrap;">',
                    '<button id="evb-verify-btn" style="padding: 10px 18px; background: #1a1a2e; border: none; border-radius: 8px; color: #d4af37; font-size: 0.9rem; font-weight: 600; cursor: pointer;">Verify Now</button>',
                    '<button id="evb-resend-btn" style="padding: 10px 18px; background: rgba(26,26,46,0.15); border: 1px solid rgba(26,26,46,0.4); border-radius: 8px; color: #1a1a2e; font-size: 0.9rem; font-weight: 600; cursor: pointer;">Resend Email</button>',
                '</div>',
            '</div>',
            '<div id="evb-status" style="max-width: 900px; margin: 10px auto 0; font-size: 0.85rem; display: none; padding: 8px 12px; background: rgba(26,26,46,0.15); border-radius: 6px;"></div>'
        ].join('');

        // Inject at the top of the body
        if (document.body.firstChild) {
            document.body.insertBefore(banner, document.body.firstChild);
        } else {
            document.body.appendChild(banner);
        }

        // Wire up buttons
        document.getElementById('evb-verify-btn').addEventListener('click', function() {
            window.location.href = 'verify-email.html?email=' + encodeURIComponent(userEmail);
        });
        document.getElementById('evb-resend-btn').addEventListener('click', resendEmail);
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function setStatus(message, type) {
        var status = document.getElementById('evb-status');
        if (!status) return;
        var bg = type === 'error' ? 'rgba(239,68,68,0.2)' : type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(26,26,46,0.15)';
        status.style.background = bg;
        status.style.display = 'block';
        status.innerHTML = message;
    }

    async function resendEmail() {
        if (resendCooldown > 0) return;
        var btn = document.getElementById('evb-resend-btn');
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
        setStatus('Sending verification email...', 'info');

        try {
            var response = await fetch(FUNCTIONS_URL + '/resendVerificationEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });
            var result = await response.json();
            if (response.ok) {
                setStatus('\u2705 Verification email sent! Check your inbox and spam folder.', 'success');
                startCooldown(60);
            } else {
                throw new Error(result.error || 'Failed to resend');
            }
        } catch (err) {
            setStatus('\u26A0 ' + (err.message || 'Could not resend email. Please try again.'), 'error');
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }

    function startCooldown(seconds) {
        resendCooldown = seconds;
        var btn = document.getElementById('evb-resend-btn');
        if (!btn) return;
        var tick = function() {
            if (resendCooldown > 0) {
                btn.textContent = 'Resend (' + resendCooldown + 's)';
                resendCooldown--;
                setTimeout(tick, 1000);
            } else {
                btn.textContent = 'Resend Email';
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        };
        tick();
    }

    function removeBanner() {
        var banner = document.getElementById(BANNER_ID);
        if (banner) banner.remove();
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
        // Update sessionStorage so we don't check again on next page load
        try {
            var saved = JSON.parse(sessionStorage.getItem('rosary73User') || '{}');
            saved.emailVerified = true;
            saved.hasValidEmail = true;
            sessionStorage.setItem('rosary73User', JSON.stringify(saved));
        } catch (e) {}
    }

    function startPolling() {
        // Poll every 30 seconds to auto-dismiss if user verifies in another tab
        pollInterval = setInterval(async function() {
            var verified = await checkEmailVerified();
            if (verified) {
                console.log('Email verified! Removing banner.');
                removeBanner();
            }
        }, 30000);
    }

    async function init() {
        if (!shouldCheckVerification()) return;
        var verified = await checkEmailVerified();
        if (verified) {
            // Cache for next page load
            try {
                currentUser.emailVerified = true;
                sessionStorage.setItem('rosary73User', JSON.stringify(currentUser));
            } catch (e) {}
            return;
        }
        // Wait until body is ready before injecting
        if (document.body) {
            createBanner();
            startPolling();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                createBanner();
                startPolling();
            });
        }
    }

    // ── Expose a global flag so subscribe/payment pages can block features ──
    window.Rosary73EmailVerified = {
        isVerified: function() {
            var u = getCurrentUser();
            return !!(u && (u.emailVerified === true || u.hasValidEmail === true));
        },
        recheck: init
    };

    // Kick off
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
