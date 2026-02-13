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

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initScrollReveal();
    initNavTracking();
    initSmoothScroll();
    initHeroParallax();
    initMobileNav();
  });
})();
