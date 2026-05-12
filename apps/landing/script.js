/* Terranium landing — minimal interactions */
(function () {
  'use strict';

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile drawer toggle
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileDrawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = !drawer.hasAttribute('hidden');
      if (open) {
        drawer.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        drawer.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        drawer.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Contact form — expand extra fields on email focus, submit via mailto
  var cForm = document.getElementById('contactForm');
  var cEmail = document.getElementById('contactEmail');
  var cExtra = document.getElementById('contactExtra');
  if (cForm && cEmail && cExtra) {
    var expand = function () {
      cForm.classList.add('is-expanded');
      cExtra.setAttribute('aria-hidden', 'false');
    };
    cEmail.addEventListener('focus', expand);
    cEmail.addEventListener('input', function () {
      if (cEmail.value.length > 0) expand();
    });

    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (cEmail.value || '').trim();
      if (!email || email.indexOf('@') === -1) {
        cEmail.focus();
        return;
      }
      var name = (cForm.querySelector('[name="name"]') || {}).value || '';
      var company = (cForm.querySelector('[name="company"]') || {}).value || '';
      var message = (cForm.querySelector('[name="message"]') || {}).value || '';

      var lines = [];
      if (name) lines.push('고객명: ' + name);
      if (company) lines.push('회사명: ' + company);
      lines.push('이메일: ' + email);
      lines.push('');
      lines.push(message || '');

      var subject = '[Terranium 도입 문의]' + (name ? ' — ' + name : '');
      var body = lines.join('\n');
      window.location.href =
        'mailto:support@doi-kr.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // Email copy buttons
  var copyBtns = document.querySelectorAll('.email-copy');
  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () {
        btn.classList.add('copied');
        setTimeout(function () { btn.classList.remove('copied'); }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallback(); });
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  // Auto-load images for placeholders when actual file is present
  // Convention: place files under ./assets/images/<data-img>
  var phs = document.querySelectorAll('.img-placeholder[data-img]');
  phs.forEach(function (el) {
    var name = el.getAttribute('data-img');
    if (!name) return;
    var src = 'assets/images/' + name;
    var probe = new Image();
    probe.onload = function () {
      el.style.background = 'url("' + src + '") center/cover no-repeat';
      el.style.borderStyle = 'solid';
      el.style.borderColor = 'transparent';
      var lab = el.querySelector('.ph-label');
      if (lab) lab.style.display = 'none';
    };
    probe.src = src;
  });

})();
