/**
 * PayPal Integration for Rosary73
 * Handles USD subscriptions, gifts, and donations via PayPal
 * PHP transactions continue through Xendit
 * 
 * Usage: Include this script in subscribe.html after the PayPal SDK script tag
 * <script src="https://www.paypal.com/sdk/js?client-id=CLIENT_ID&vault=true&intent=subscription&currency=USD"></script>
 * <script src="paypal-integration.js"></script>
 */

(function() {
    'use strict';

    // =============================================
    // CONFIGURATION
    // =============================================
    const PAYPAL_CONFIG = {
        clientId: 'Aa4mUqIMHbxTlWAUyte1e-A3d7eLQDNjgJY1iGI7wlnDVl13gbeX6T2-1VVyuwBqQvdYf7MTfK7Ab7Tn',
        plans: {
            threeMonth:  'P-92M289068U041772CNHOKWGQ',
            sixMonth:    'P-4EH579885R318553ANHOLJBI',
            twelveMonth: 'P-9C957870A23058004NHOLKVY'
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
        // Check if user is non-PH (USD pricing)
        if (!currentUser) return false;
        const country = (currentUser.country || '').toLowerCase();
        const regionCode = (currentUser.regionCode || '').toUpperCase();
        return country !== 'philippines' && regionCode !== 'PH';
    }

    function getPlanIdFromSelection(planKey) {
        // Map plan selection to PayPal plan ID
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
        // Show success message and redirect
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
        // Calculate end date
        var months = getPlanMonths(planKey);
        var endDate = new Date();
        
        // If user has existing active subscription, extend from current end date
        if (currentUser && currentUser.subscriptionStatus === 'active' && currentUser.subscriptionEndDate) {
            var existingEnd = currentUser.subscriptionEndDate.toDate ? 
                currentUser.subscriptionEndDate.toDate() : new Date(currentUser.subscriptionEndDate);
            if (existingEnd > new Date()) {
                endDate = existingEnd;
            }
        }
        endDate.setMonth(endDate.getMonth() + months);

        // Write V2 subscription schema to Firestore
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
            
            // Record payment intent
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
            // Look up recipient by username
            var usersRef = firebase.firestore().collection('users');
            var snapshot = await usersRef.where('usernameLowercase', '==', recipientUsername.toLowerCase()).get();
            
            if (snapshot.empty) {
                throw new Error('Recipient username not found: ' + recipientUsername);
            }
            
            var recipientDoc = snapshot.docs[0];
            var recipientData = recipientDoc.data();
            var recipientId = recipientDoc.id;
            
            // Calculate end date for recipient
            var endDate = new Date();
            if (recipientData.subscriptionStatus === 'active' && recipientData.subscriptionEndDate) {
                var existingEnd = recipientData.subscriptionEndDate.toDate ? 
                    recipientData.subscriptionEndDate.toDate() : new Date(recipientData.subscriptionEndDate);
                if (existingEnd > new Date()) {
                    endDate = existingEnd;
                }
            }
            endDate.setMonth(endDate.getMonth() + months);
            
            // Activate gift on recipient
            await firebase.firestore().collection('users').doc(recipientId).update({
                subscriptionTier: 'gifted',
                subscriptionStatus: 'active',
                subscriptionPlan: planKey,
                subscriptionEndDate: firebase.firestore.Timestamp.fromDate(endDate),
                subscriptionSchemaVersion: 2,
                subscriptionProvider: 'paypal',
                subscriptionUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Record gift
            await firebase.firestore().collection('paymentIntents').add({
                userId: currentUser.uid || 'unknown',
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
            await firebase.firestore().collection('donations').add({
                userId: currentUser ? (currentUser.uid || 'anonymous') : 'anonymous',
                username: currentUser ? (currentUser.username || 'anonymous') : 'anonymous',
                type: 'donation',
                provider: 'paypal',
                paypalOrderId: orderId,
                amount: amount,
                currency: 'USD',
                status: 'completed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await firebase.firestore().collection('paymentIntents').add({
                userId: currentUser ? (currentUser.uid || 'anonymous') : 'anonymous',
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
                    showPayPalSuccess(containerId.includes('gift') ? 'gift' : 'donation', data);
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
        
        // Remove USD disabled banner if present
        var usdBanner = document.getElementById('usd-beta-notice');
        if (usdBanner) usdBanner.style.display = 'none';
        var usdModal = document.getElementById('usdBetaModal');
        if (usdModal) usdModal.style.display = 'none';
        
        // 1. Subscribe tab — PayPal subscription buttons
        renderSubscriptionButtons('paypal-subscribe-buttons', function() {
            // Get currently selected plan from the subscribe tab
            var selected = document.querySelector('#subscribe-plans .plan-card.selected, #subscribe-plans .plan-option.selected, [data-tab="subscribe"] .plan-card.selected');
            if (selected) {
                return selected.getAttribute('data-plan') || selected.getAttribute('data-months');
            }
            // Fallback: check for any selected plan card in subscribe section
            var allSelected = document.querySelectorAll('.plan-card.selected');
            if (allSelected.length > 0) return allSelected[0].getAttribute('data-plan');
            return null;
        });
        
        // 2. Upgrade tab — PayPal subscription buttons (same plans, extends existing)
        renderSubscriptionButtons('paypal-upgrade-buttons', function() {
            var selected = document.querySelector('#upgrade-plans .plan-card.selected, #upgrade-plans .plan-option.selected, [data-tab="upgrade"] .plan-card.selected');
            if (selected) {
                return selected.getAttribute('data-plan') || selected.getAttribute('data-months');
            }
            return null;
        });
        
        // 3. Gift tab — PayPal one-time order
        renderOrderButtons('paypal-gift-buttons', 
            function() {
                // Get gift plan price
                var selected = document.querySelector('#gift-plans .plan-card.selected, #gift-plans .plan-option.selected, [data-tab="gift"] .plan-card.selected');
                if (selected) {
                    var planKey = selected.getAttribute('data-plan') || selected.getAttribute('data-months');
                    selectedGiftPlan = planKey;
                    return PAYPAL_CONFIG.giftPrices[planKey] || PAYPAL_CONFIG.giftPrices['threeMonth'];
                }
                return 0;
            },
            function() {
                return 'Rosary73 Gift Subscription for ' + (giftRecipientUsername || 'user');
            },
            async function(orderId, order) {
                // Get recipient username from the gift input field
                var recipientInput = document.querySelector('#gift-recipient, #giftRecipientInput, [name="giftRecipient"], .gift-recipient-input');
                giftRecipientUsername = recipientInput ? recipientInput.value.trim() : '';
                if (!giftRecipientUsername) {
                    throw new Error('Please enter a recipient username');
                }
                await activatePayPalGift(orderId, selectedGiftPlan, giftRecipientUsername);
            }
        );
        
        // 4. Donate tab — PayPal one-time order
        renderOrderButtons('paypal-donate-buttons',
            function() {
                // Get selected donation amount
                var selected = document.querySelector('#donate-amounts .amount-card.selected, #donate-amounts .donation-option.selected, [data-tab="donate"] .amount-card.selected');
                if (selected) {
                    selectedDonationAmount = parseFloat(selected.getAttribute('data-amount'));
                    return selectedDonationAmount;
                }
                // Check for custom amount input
                var customInput = document.querySelector('#custom-donation-amount, #customDonationInput, .custom-donation-input');
                if (customInput && customInput.value) {
                    selectedDonationAmount = parseFloat(customInput.value);
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
