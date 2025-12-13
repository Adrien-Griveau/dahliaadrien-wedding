// Language Switcher functionality
(function() {
  'use strict';

  // Get current language from localStorage or default to 'en'
  let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

  // Function to change language
  function changeLanguage(lang) {
    if (!translations[lang]) {
      console.error('Language not found:', lang);
      return;
    }

    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Update all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update dropdown selected option
    document.querySelectorAll('.language-dropdown').forEach(dropdown => {
      dropdown.value = lang;
    });

    // Update dropdown button text
    const langAbbr = {
      'en': 'EN',
      'fr': 'FR',
      'it': 'IT'
    };
    document.querySelectorAll('.language-dropdown-btn').forEach(btn => {
      btn.querySelector('.language-dropdown-selected').textContent = langAbbr[lang] || lang.toUpperCase();
    });
    
    // Update active option in dropdowns
    document.querySelectorAll('.language-option').forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
  }

  // Initialize language on page load
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    changeLanguage(currentLanguage);

    // Handle standard dropdown change
    document.querySelectorAll('.language-dropdown').forEach(dropdown => {
      dropdown.addEventListener('change', function() {
        changeLanguage(this.value);
      });
    });

    // Handle custom dropdown (button-based)
    document.querySelectorAll('.language-dropdown-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const menu = this.nextElementSibling;
        menu.classList.toggle('show');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.language-switcher')) {
        document.querySelectorAll('.language-menu').forEach(menu => {
          menu.classList.remove('show');
        });
      }
    });

    // Handle custom dropdown option selection
    document.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const lang = this.getAttribute('data-lang');
        changeLanguage(lang);
        
        // Close all dropdowns
        document.querySelectorAll('.language-menu').forEach(menu => {
          menu.classList.remove('show');
        });
      });
    });
  });

  // Export changeLanguage function for global access if needed
  window.changeLanguage = changeLanguage;
})();

