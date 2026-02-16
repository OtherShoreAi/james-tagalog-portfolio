/* ================================================
   main.js — Portfolio Interactions
   ================================================ */

(function () {
  'use strict';

  // --- Theme Toggle (text-based) ---
  function initTheme() {
    var root = document.documentElement;
    var toggleContainer = document.getElementById('themeToggle');
    var darkBtn = toggleContainer.querySelector('.theme-toggle__option--dark');
    var lightBtn = toggleContainer.querySelector('.theme-toggle__option--light');

    // Check localStorage first, then system preference
    var stored = localStorage.getItem('theme');
    if (stored) {
      root.setAttribute('data-theme', stored);
    } else {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    updateActiveState();

    // Click handlers for each option
    darkBtn.addEventListener('click', function () {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      updateActiveState();
    });

    lightBtn.addEventListener('click', function () {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      updateActiveState();
    });

    function updateActiveState() {
      var current = root.getAttribute('data-theme');
      darkBtn.classList.toggle('theme-toggle__option--active', current === 'dark');
      lightBtn.classList.toggle('theme-toggle__option--active', current === 'light');
    }
  }

  // --- Scroll Reveal (Intersection Observer) ---
  function initScrollReveal() {
    var revealElements = document.querySelectorAll(
      '.section:not(.section--hero) .reveal-up'
    );

    if (!revealElements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Active Navigation Tracking ---
  function initNavTracking() {
    var sections = document.querySelectorAll('.section[id]');
    var navLinks = document.querySelectorAll('.nav__link');

    if (!sections.length || !navLinks.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');

            navLinks.forEach(function (link) {
              link.classList.remove('nav__link--active');
              if (link.getAttribute('data-section') === id) {
                link.classList.add('nav__link--active');
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -10% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile nav if open before scrolling
      var nav = document.getElementById('mainNav');
      var hamburger = document.getElementById('navHamburger');
      if (nav && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // --- Mobile Hamburger Menu ---
  function initMobileNav() {
    var nav = document.getElementById('mainNav');
    var hamburger = document.getElementById('navHamburger');
    var navLinks = nav.querySelectorAll('.nav__link');

    if (!hamburger) return;

    hamburger.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('nav--open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('nav--open')) {
          nav.classList.remove('nav--open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Hero Parallax (subtle mouse-follow on decoration) ---
  function initHeroParallax() {
    var hero = document.querySelector('.section--hero');
    var decoration = document.querySelector('.hero__decoration');

    if (!hero || !decoration) return;

    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      requestAnimationFrame(function () {
        decoration.style.transform =
          'translate(' + x * 20 + 'px, ' + y * 20 + 'px)';
      });
    });

    hero.addEventListener('mouseleave', function () {
      requestAnimationFrame(function () {
        decoration.style.transform = 'translate(0, 0)';
      });
    });
  }

  // --- Demo Section (Two-Step Interactive) ---
  function initDemo() {
    var grid = document.querySelector('.demo__grid');
    var form = document.getElementById('demoForm');
    var nextBtn = document.getElementById('demoNext');
    var backBtn = document.getElementById('demoBack');
    var submitBtn = document.getElementById('demoSubmit');
    var retryBtn = document.getElementById('demoRetry');

    if (!grid || !form) return;

    var stepIndicators = document.querySelectorAll('.demo__step');
    var scenarioInputs = document.querySelectorAll('.demo__pill-input');
    var selectedScenarioSpan = document.querySelector('.demo__selected-scenario');
    var nameInput = document.getElementById('demoName');
    var phoneInput = document.getElementById('demoPhone');
    var emailInput = document.getElementById('demoEmail');

    var resultSuccess = document.querySelector('.demo__result--success');
    var resultError = document.querySelector('.demo__result--error');
    var resultPlaceholder = document.querySelector('.demo__result--placeholder');

    // Set to true once Retell API is wired up
    var BACKEND_READY = false;

    var scenarioLabels = {
      'customer-service': 'Customer Service',
      'lead-qualification': 'Lead Qualification',
      'appointment-setting': 'Appointment Setting'
    };

    function goToStep(step) {
      grid.setAttribute('data-active-step', step);
      stepIndicators.forEach(function (el) {
        el.classList.toggle('demo__step--active', el.getAttribute('data-step') === String(step));
      });
      if (step === 2) {
        var checked = document.querySelector('.demo__pill-input:checked');
        if (checked && selectedScenarioSpan) {
          selectedScenarioSpan.textContent = scenarioLabels[checked.value] || checked.value;
        }
        validateForm();
      }
    }

    nextBtn.addEventListener('click', function () {
      goToStep(2);
    });

    backBtn.addEventListener('click', function () {
      goToStep(1);
      hideAllResults();
    });

    scenarioInputs.forEach(function (input) {
      input.addEventListener('change', function () {
        if (selectedScenarioSpan) {
          selectedScenarioSpan.textContent = scenarioLabels[input.value] || input.value;
        }
      });
    });

    function validateForm() {
      var nameValid = nameInput.value.trim().length >= 2;
      var phoneValid = /^\+?[\d\s\-().]{7,}$/.test(phoneInput.value.trim());
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      submitBtn.disabled = !(nameValid && phoneValid && emailValid);
      return nameValid && phoneValid && emailValid;
    }

    function showFieldError(inputId, message) {
      var errorEl = document.querySelector('.demo__error[data-for="' + inputId + '"]');
      var inputEl = document.getElementById(inputId);
      if (errorEl) errorEl.textContent = message;
      if (inputEl) inputEl.classList.toggle('demo__input--invalid', !!message);
    }

    function clearFieldErrors() {
      document.querySelectorAll('.demo__error').forEach(function (el) { el.textContent = ''; });
      document.querySelectorAll('.demo__input').forEach(function (el) { el.classList.remove('demo__input--invalid'); });
    }

    [nameInput, phoneInput, emailInput].forEach(function (input) {
      input.addEventListener('input', function () {
        clearFieldErrors();
        validateForm();
      });
    });

    function hideAllResults() {
      [resultSuccess, resultError, resultPlaceholder].forEach(function (el) {
        if (el) el.hidden = true;
      });
      if (form) form.style.display = '';
    }

    function showResult(type) {
      form.style.display = 'none';
      if (type === 'success' && resultSuccess) resultSuccess.hidden = false;
      if (type === 'error' && resultError) resultError.hidden = false;
      if (type === 'placeholder' && resultPlaceholder) resultPlaceholder.hidden = false;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFieldErrors();

      var hasErrors = false;
      if (nameInput.value.trim().length < 2) { showFieldError('demoName', 'Please enter your name'); hasErrors = true; }
      if (!/^\+?[\d\s\-().]{7,}$/.test(phoneInput.value.trim())) { showFieldError('demoPhone', 'Please enter a valid phone number'); hasErrors = true; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) { showFieldError('demoEmail', 'Please enter a valid email address'); hasErrors = true; }
      if (hasErrors) return;

      if (!BACKEND_READY) {
        showResult('placeholder');
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      var payload = {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        email: emailInput.value.trim(),
        scenario: document.querySelector('.demo__pill-input:checked').value
      };

      fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          return res.json();
        })
        .then(function () {
          submitBtn.classList.remove('is-loading');
          showResult('success');
        })
        .catch(function () {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          showResult('error');
        });
    });

    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        hideAllResults();
        goToStep(2);
      });
    }
  }

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initScrollReveal();
    initNavTracking();
    initSmoothScroll();
    initHeroParallax();
    initMobileNav();
    initDemo();
  });
})();
