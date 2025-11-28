/**
 * Rosary73 Theme Toggle System
 * Handles light/dark mode switching with localStorage persistence
 * and system preference detection
 */

(function() {
    'use strict';
    
    const html = document.documentElement;
    
    // Initialize theme on page load (runs before DOM is ready)
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        html.setAttribute('data-theme', theme);
    }
    
    // Get current theme
    function getCurrentTheme() {
        return html.getAttribute('data-theme') || 'light';
    }
    
    // Set theme
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#0D1117' : '#FFFFFF');
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }
    
    // Initialize theme immediately
    initTheme();
    
    // Set up toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Expose functions globally for debugging if needed
    window.R73Theme = {
        toggle: toggleTheme,
        set: setTheme,
        get: getCurrentTheme
    };
})();
