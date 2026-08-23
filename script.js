(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dark Mode Toggle
  function initTheme() {
    var toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    // Check localStorage or system preference
    var currentTheme = localStorage.getItem('theme');
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    }

    toggleBtn.addEventListener('click', function () {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // Fade up animations
  function initFadeAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.fade-up').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Count up animations
  function animateCount(el, target, duration) {
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }

    var start = 0;
    var startTime = null;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = Math.round(start + (target - start) * easedProgress);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function initCountUp() {
    // Stats section removed, but keeping function structure intact just in case
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion) {
      counters.forEach(function (el) {
        el.textContent = parseInt(el.dataset.count, 10).toLocaleString();
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.dataset.count, 10);
          var duration = target > 100 ? 2000 : 1200;
          animateCount(entry.target, target, duration);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  // Save / Bookmark button interaction
  function initSaveButton() {
    var saveBtn = document.getElementById('save-site-btn');
    var toast = document.getElementById('save-toast');
    if (!saveBtn || !toast) return;

    var toastTimeout = null;

    saveBtn.addEventListener('click', function () {
      if (navigator.clipboard && window.location.href) {
        navigator.clipboard.writeText(window.location.href).catch(function () {});
      }

      toast.classList.add('visible');
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
      toastTimeout = setTimeout(function () {
        toast.classList.remove('visible');
      }, 3500);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initFadeAnimations();
    initCountUp();
    initSaveButton();
  });
})();
