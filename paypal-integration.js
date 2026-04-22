/**
 * PayPal Integration for Rosary73
 * Handles USD subscriptions, gifts, and donations via PayPal
 * PHP transactions continue through Xendit
 *
 * Works with both:
 *   - subscribe.html (4-tab layout: Subscribe, Upgrade, Gift, Donate)
 *   - members.html   (sidebar dashboard with Subscribe, Gift, Donate sections)
 *
 * Usage:
 *   <script src="https://www.paypal.com/sdk/js?client-id=CLIENT_ID&vault=true&currency=USD"></script>
 *   <script src="paypal-integration.js"></script>
 *   // Then after user login:
 *   Rosary73PayPal.init(userData);
 *
 * UPDATED: Apr 22, 2026 — switched to LIVE credentials
 */

(function() {
    'use strict';

    // =============================================
    // CONFIGURATION — LIVE PRODUCTION (Apr 22, 2026)
    // =============================================
    const PAYPAL_CONFIG = {
        clientId: 'AQpVJ-HcS6IUwD4mAqPPI3CjO-yWVGJAskogSH9H7zQ39Jhd8o2pYAE1nGzs7BMjYx2vZPA0iFJ50Hfm',
        plans: {
            threeMonth:  'P-20B683686G1122848NHUDSSA',
            sixMonth:    'P-46200420PR542923VNHUDSWY',
            twelveMonth: 'P-8P625064Y5644281PNHUDSZY'
        },
        prices: {
            threeMonth:  2.99,
            sixMonth:    5.99,
            twelveMonth: 9.99
        },
        donationAmounts: [2, 5, 10, 20, 50],
        giftPrices: {
            threeMonth:  2.99,
            sixMonth:    5.99,
            twelveMonth: 9.99
        }
    };

    // =============================================
    // STATE
    // =============================================
    let currentUser = null;
    let selectedSubscriptionPlan = null;
    let selectedGiftPlan = null;
    let selectedDonationAmount = null;
    let giftRecipientUsername = null;

    // =============================================
    // HELPERS
    // =============================================

    function isUSDUser() {
        // Non-PH users pay in USD via PayPal. Normalized: anything not PH is USD.
        if (!currentUser) return false;
        const country = (currentUser.country || '').toLowerCase();
        const regionCode = (currentUser.regionCode || '').toUpperCase();
        // Philippines users use Xendit, everyone else uses PayPal
        return country !== 'philippines' && regionCode !== 'PH';
    }

    function getPlanIdFromSelection(planKey) {
        const map = {
            'threeMonth':  PAYPAL_CONFIG.plans.threeMonth,
            'sixMonth':    PAYPAL_CONFIG.plans.sixMonth,
            'twelveMonth': PAYPAL_CONFIG.plans.twelveMonth,
            '3':           PAYPAL_CONFIG.plans.threeMonth,
            '6':           PAYPAL_CONFIG.plans.sixMonth,
            '12':          PAYPAL_CONFIG.plans.twelveMonth
        };
        return map[planKey] || null;
    }

    function getPlanMonths(planKey) {
        const map = {
            'threeMonth': 3, 'sixMonth': 6, 'twelveMonth': 12,
            '3': 3, '6': 6, '12': 12
        };
        return map[planKey] || 3;
    }

    function showPayPalSuccess(type, details) {
        const overlay = document.getElementById('paypal-success-overlay');
        if (overlay) {
            const msg = document.getElementById('paypal-success-message');
            if (msg) {
                switch(type) {
                    case 'subscription':
                        msg.textContent = 'Subscription activated! Redirecting...';
                        break;
                    case 'gift':
                        msg.textContent = 'Gift sent successfully! Redirecting...';
                        break;
                    case 'donation':
                        msg.textContent = 'Thank you for your donation! Redirecting...';
                        break;
                }
            }
            overlay.style.display = 'flex';
            setTimeout(function() {
                window.location.href = 'payment-success.html';
            }, 2000);
        } else {
            alert('Payment successful! Thank you.');
            window.location.href = 'payment-success.html';
        }
    }

    function showPayPalError(err) {
        console.error('PayPal error:', err);
        alert('Payment could not be completed. Please try again.');
    }

    // =============================================
    // FIREBASE ACTIVATION (called after payment)
    // =============================================

    async function activatePayPalSubscription(subscriptionId, planKey, userId) {
        var months = getPlanMonths(planKey);
        var endDate = new Date();

        // Extend existing active subscription
        if (currentUser && currentUser.subscriptionStatus === 'active' && currentUser.subscriptionEndDate) {
            var existingEnd = currentUser.subscriptionEndDate.toDate ?
                currentUser.subscriptionEndDate.toDate() : new Date(currentUser.subscriptionEndDate);
            if (existingEnd > new Date()) {
                endDate = existingEnd;
            }
        }
        endDate.setMonth(endDate.getMonth() + months);

        try {
            var userRef = firebase.firestore().collection('users').doc(userId);
            await userRef.update({
                subscriptionTier: 'paid',
                subscriptionStatus: 'active',
                subscriptionPlan: planKey,
                subscriptionEndDate: firebase.firestore.Timestamp.fromDate(endDate),
                subscriptionSchemaVersion: 2,
                subscriptionProvider: 'paypal',
                paypalSubscriptionId: subscriptionId,
                subscriptionUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('PayPal subscription activated in Firestore:', subscriptionId);

            await firebase.firestore().collection('paymentIntents').add({
                userId: userId,
                type: 'subscription',
                provider: 'paypal',
                paypalSubscriptionId: subscriptionId,
                plan: planKey,
                amount: PAYPAL_CONFIG.prices[planKey],
                currency: 'USD',
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return true;
        } catch (err) {
            console.error('Failed to activate subscription in Firestore:', err);
            throw err;
        }
    }

    async function activatePayPalGift(orderId, planKey, recipientUsername) {
        var months = getPlanMonths(planKey);

        try {
            var usersRef = firebase.firestore().collection('users');
            var snapshot = await usersRef.where('usernameLowercase', '==', recipientUsername.toLowerCase()).get();

            if (snapshot.empty) {
                throw new Error('Recipient username not found: ' + recipientUsername);
            }

            var recipientDoc = snapshot.docs[0];
            var recipientData = recipientDoc.data();
            var recipientId = recipientDoc.id;

            var endDate = new Date();
            if (recipientData.subscriptionStatus === 'active' && recipientData.subscriptionEndDate) {
                var existingEnd = recipientData.subscriptionEndDate.toDate ?
                    recipientData.subscriptionEndDate.toDate() : new Date(recipientData.subscriptionEndDate);
                if (existingEnd > new Date()) {
                    endDate = existingEnd;
                }
            }
            endDate.setMonth(endDate.getMonth() + months);

            await firebase.firestore().collection('users').doc(recipientId).update({
                subscriptionTier: 'gifted',
                subscriptionStatus: 'active',
                subscriptionPlan: planKey,
                subscriptionEndDate: firebase.firestore.Timestamp.fromDate(endDate),
                subscriptionSchemaVersion: 2,
                subscriptionProvider: 'paypal',
                subscriptionUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await firebase.firestore().collection('paymentIntents').add({
                userId: (currentUser && (currentUser.uid || currentUser.userId)) || 'unknown',
                recipientId: recipientId,
                recipientUsername: recipientUsername,
                type: 'gift',
                provider: 'paypal',
                paypalOrderId: orderId,
                plan: planKey,
                amount: PAYPAL_CONFIG.giftPrices[planKey],
                currency: 'USD',
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Gift activated for', recipientUsername);
            return true;
        } catch (err) {
            console.error('Failed to activate gift:', err);
            throw err;
        }
    }

    async function recordPayPalDonation(orderId, amount) {
        try {
            var userId = currentUser ? (currentUser.uid || currentUser.userId || 'anonymous') : 'anonymous';
            var username = currentUser ? (currentUser.username || 'anonymous') : 'anonymous';

            await firebase.firestore().collection('donations').add({
                userId: userId,
                username: username,
                type: 'donation',
                provider: 'paypal',
                paypalOrderId: orderId,
                amount: amount,
                currency: 'USD',
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await firebase.firestore().collection('paymentIntents').add({
                userId: userId,
                type: 'donation',
                provider: 'paypal',
                paypalOrderId: orderId,
                amount: amount,
                currency: 'USD',
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Donation recorded:', amount, 'USD');
            return true;
        } catch (err) {
            console.error('Failed to record donation:', err);
            throw err;
        }
    }

    // =============================================
    // PAYPAL BUTTON RENDERERS
    // =============================================

    function renderSubscriptionButtons(containerId, getPlanKey) {
        if (!window.paypal) {
            console.warn('PayPal SDK not loaded');
            return;
        }

        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe'
            },
            createSubscription: function(data, actions) {
                var planKey = getPlanKey();
                if (!planKey) {
                    alert('Please select a subscription plan first.');
                    return actions.reject();
                }
                var planId = getPlanIdFromSelection(planKey);
                if (!planId) {
                    alert('Invalid plan selected.');
                    return actions.reject();
                }
                selectedSubscriptionPlan = planKey;
                return actions.subscription.create({
                    plan_id: planId
                });
            },
            onApprove: async function(data, actions) {
                try {
                    var userId = currentUser ? (currentUser.uid || currentUser.userId) : null;
                    if (userId && selectedSubscriptionPlan) {
                        await activatePayPalSubscription(data.subscriptionID, selectedSubscriptionPlan, userId);
                    }
                    showPayPalSuccess('subscription', data);
                } catch (err) {
                    showPayPalError(err);
                }
            },
            onError: function(err) {
                showPayPalError(err);
            },
            onCancel: function() {
                console.log('PayPal subscription cancelled by user');
            }
        }).render('#' + containerId);
    }

    function renderOrderButtons(containerId, getAmount, getDescription, onSuccess) {
        if (!window.paypal) {
            console.warn('PayPal SDK not loaded');
            return;
        }

        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'pay'
            },
            createOrder: function(data, actions) {
                var amount = getAmount();
                var description = getDescription();
                if (!amount || amount <= 0) {
                    alert('Please select an amount first.');
                    return actions.reject();
                }
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toFixed(2),
                            currency_code: 'USD'
                        },
                        description: description
                    }]
                });
            },
            onApprove: async function(data, actions) {
                var order = await actions.order.capture();
                try {
                    await onSuccess(data.orderID, order);
                    showPayPalSuccess(containerId.indexOf('gift') !== -1 ? 'gift' : 'donation', data);
                } catch (err) {
                    showPayPalError(err);
                }
            },
            onError: function(err) {
                showPayPalError(err);
            },
            onCancel: function() {
                console.log('PayPal order cancelled by user');
            }
        }).render('#' + containerId);
    }

    // =============================================
    // SELECTOR HELPERS (support subscribe.html + members.html)
    // =============================================

    function findSelectedPlan(selectors) {
        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);
            if (el) return el.getAttribute('data-plan') || el.getAttribute('data-months');
        }
        return null;
    }

    function findSelectedAmount(selectors) {
        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);
            if (el) {
                var amt = parseFloat(el.getAttribute('data-amount'));
                if (!isNaN(amt)) return amt;
            }
        }
        return null;
    }

    function findInputValue(selectors) {
        for (var i = 0; i < selectors.length; i++) {
            var el = document.querySelector(selectors[i]);
            if (el && el.value) return el.value.trim();
        }
        return '';
    }

    // =============================================
    // INITIALIZATION
    // =============================================

    function initPayPalForUSD(user) {
        currentUser = user;

        if (!isUSDUser()) {
            console.log('PayPal: PH user detected, skipping PayPal (using Xendit)');
            return;
        }

        console.log('PayPal: USD user detected, initializing PayPal buttons');

        // Show PayPal containers, hide Xendit credit card sections for USD
        document.querySelectorAll('.paypal-usd-container').forEach(function(el) {
            el.style.display = 'block';
        });
        document.querySelectorAll('.xendit-card-section').forEach(function(el) {
            el.style.display = 'none';
        });

        // Remove USD disabled banners/modals if present
        ['usd-beta-notice', 'usdBetaModal', 'usd-beta-banner', 'usd-beta-banner-members'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // 1. Subscribe — PayPal subscription buttons
        renderSubscriptionButtons('paypal-subscribe-buttons', function() {
            var plan = findSelectedPlan([
                '#subscribe-plans .plan-card.selected',
                '#subscribe-plans .plan-option.selected',
                '[data-tab="subscribe"] .plan-card.selected',
                '#plans-grid .plan-card.selected',
                '#section-subscribe .plan-card.selected',
                '#tab-subscribe .plan-card.selected'
            ]);
            if (plan) return plan;

            var all = document.querySelectorAll('.plan-card.selected');
            for (var i = 0; i < all.length; i++) {
                var el = all[i];
                if (el.closest('#gift-plans, #gift-plans-grid, #upgrade-plans, [data-tab="gift"], [data-tab="upgrade"], #section-gift, #tab-gift, #tab-upgrade')) continue;
                return el.getAttribute('data-plan');
            }
            return null;
        });

        // 2. Upgrade
        renderSubscriptionButtons('paypal-upgrade-buttons', function() {
            return findSelectedPlan([
                '#upgrade-plans .plan-card.selected',
                '#upgrade-plans .plan-option.selected',
                '[data-tab="upgrade"] .plan-card.selected',
                '#tab-upgrade .plan-card.selected'
            ]);
        });

        // 3. Gift — PayPal one-time order
        renderOrderButtons('paypal-gift-buttons',
            function() {
                var plan = findSelectedPlan([
                    '#gift-plans .plan-card.selected',
                    '#gift-plans .plan-option.selected',
                    '[data-tab="gift"] .plan-card.selected',
                    '#gift-plans-grid .plan-card.selected',
                    '#section-gift .plan-card.selected',
                    '#tab-gift .plan-card.selected'
                ]);
                if (plan) {
                    selectedGiftPlan = plan;
                    return PAYPAL_CONFIG.giftPrices[plan] || PAYPAL_CONFIG.giftPrices['threeMonth'];
                }
                return 0;
            },
            function() {
                return 'Rosary73 Gift Subscription for ' + (giftRecipientUsername || 'user');
            },
            async function(orderId, order) {
                giftRecipientUsername = findInputValue([
                    '#gift-recipient',
                    '#giftRecipientInput',
                    '[name="giftRecipient"]',
                    '.gift-recipient-input'
                ]);
                if (!giftRecipientUsername) {
                    throw new Error('Please enter a recipient username');
                }
                await activatePayPalGift(orderId, selectedGiftPlan, giftRecipientUsername);
            }
        );

        // 4. Donate — PayPal one-time order
        renderOrderButtons('paypal-donate-buttons',
            function() {
                var amount = findSelectedAmount([
                    '#donate-amounts .amount-card.selected',
                    '#donate-amounts .donation-option.selected',
                    '[data-tab="donate"] .amount-card.selected',
                    '#donation-grid .donation-amount.selected',
                    '#section-donate .donation-amount.selected',
                    '#tab-donate .amount-card.selected'
                ]);
                if (amount) {
                    selectedDonationAmount = amount;
                    return selectedDonationAmount;
                }
                var custom = findInputValue([
                    '#custom-donation',
                    '#custom-donation-amount',
                    '#customDonationInput',
                    '.custom-donation-input'
                ]);
                if (custom) {
                    selectedDonationAmount = parseFloat(custom);
                    return selectedDonationAmount;
                }
                return 0;
            },
            function() {
                return 'Rosary73 Donation - $' + (selectedDonationAmount || 0);
            },
            async function(orderId, order) {
                await recordPayPalDonation(orderId, selectedDonationAmount);
            }
        );
    }

    // =============================================
    // EXPOSE TO GLOBAL SCOPE
    // =============================================
    window.Rosary73PayPal = {
        init: initPayPalForUSD,
        config: PAYPAL_CONFIG,
        isUSDUser: isUSDUser
    };

})();
