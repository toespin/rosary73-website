// Rosary73 Website Enhancement Script
// Adds Sign Up and Subscribe links to navigation and CTA buttons to sections

document.addEventListener('DOMContentLoaded', function() {
  // Add Sign Up and Subscribe to navigation
  var navMenu = document.getElementById('navMenu');
  if (navMenu) {
    var faqLink = navMenu.querySelector('a[href="faq.html"]');
    if (faqLink && faqLink.parentElement) {
      var faqLi = faqLink.parentElement;
      
      // Create Sign Up link
      var signupLi = document.createElement('li');
      signupLi.innerHTML = '<a href="signup.html" class="nav-link">Sign Up</a>';
      
      // Create Subscribe link
      var subscribeLi = document.createElement('li');
      subscribeLi.innerHTML = '<a href="subscribe.html" class="nav-link">Subscribe</a>';
      
      // Insert after FAQ
      faqLi.parentNode.insertBefore(signupLi, faqLi.nextSibling);
      signupLi.parentNode.insertBefore(subscribeLi, signupLi.nextSibling);
    }
  }
  
  // Add CTA buttons to Features section
  var featuresSection = document.getElementById('features');
  if (featuresSection) {
    var featuresGrid = featuresSection.querySelector('.features-grid-enhanced');
    if (featuresGrid) {
      var ctaDiv = document.createElement('div');
      ctaDiv.className = 'section-cta';
      ctaDiv.style.cssText = 'text-align: center; margin-top: 50px;';
      ctaDiv.innerHTML = '<a href="signup.html" class="btn-modern btn-primary-modern" style="margin-right: 15px;">Create Free Account</a>' +
                         '<a href="subscribe.html" class="btn-modern btn-secondary-modern">Subscribe Now</a>';
      featuresGrid.parentNode.insertBefore(ctaDiv, featuresGrid.nextSibling);
    }
  }
  
  // Add CTA buttons to How It Works section
  var howItWorks = document.getElementById('how-it-works');
  if (howItWorks) {
    var videoCta = howItWorks.querySelector('.video-cta');
    if (videoCta) {
      var ctaDiv = document.createElement('div');
      ctaDiv.className = 'section-cta';
      ctaDiv.style.cssText = 'text-align: center; margin-top: 30px;';
      ctaDiv.innerHTML = '<a href="signup.html" class="btn-modern btn-primary-modern" style="margin-right: 15px;">Get Started Free</a>' +
                         '<a href="subscribe.html" class="btn-modern btn-secondary-modern">View Plans</a>';
      videoCta.parentNode.insertBefore(ctaDiv, videoCta.nextSibling);
    }
  }
  
  // Add CTA buttons to App Preview section
  var appPreview = document.getElementById('app-preview');
  if (appPreview) {
    var mockupGrid = appPreview.querySelector('.mockup-grid');
    if (mockupGrid) {
      var ctaDiv = document.createElement('div');
      ctaDiv.className = 'section-cta';
      ctaDiv.style.cssText = 'text-align: center; margin-top: 50px;';
      ctaDiv.innerHTML = '<a href="signup.html" class="btn-modern btn-primary-modern" style="margin-right: 15px;">Sign Up Now</a>' +
                         '<a href="subscribe.html" class="btn-modern btn-secondary-modern">Subscribe</a>';
      mockupGrid.parentNode.insertBefore(ctaDiv, mockupGrid.nextSibling);
    }
  }
  
  // Add CTA buttons to Privacy section
  var privacySection = document.querySelector('.privacy-section');
  if (privacySection) {
    var privacyCard = privacySection.querySelector('.privacy-card');
    if (privacyCard) {
      var ctaDiv = document.createElement('div');
      ctaDiv.style.cssText = 'text-align: center; margin-top: 30px;';
      ctaDiv.innerHTML = '<a href="signup.html" class="btn-modern btn-primary-modern" style="margin-right: 15px;">Join Anonymously</a>' +
                         '<a href="subscribe.html" class="btn-modern btn-secondary-modern">Subscribe</a>';
      privacyCard.appendChild(ctaDiv);
    }
  }
  
  // Add CTA buttons to Pricing section
  var pricingSection = document.getElementById('pricing');
  if (pricingSection) {
    var priceCard = pricingSection.querySelector('.price-card-simple');
    if (priceCard) {
      // Check if there's already a CTA in the clergy-note
      var clergyNote = priceCard.querySelector('.clergy-note');
      if (clergyNote) {
        var ctaDiv = document.createElement('div');
        ctaDiv.style.cssText = 'text-align: center; margin-top: 20px;';
        ctaDiv.innerHTML = '<a href="signup.html" style="color: #d4af37; margin-right: 20px;">Create Account</a>' +
                           '<a href="subscribe.html" style="color: #d4af37;">Subscribe Now</a>';
        clergyNote.appendChild(ctaDiv);
      }
    }
  }
});
