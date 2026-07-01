(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5532991194713';

  /* ------------------------------------------------------------------ */
  /* Logo fallback — usa texto enquanto logo-select.png não existir      */
  /* ------------------------------------------------------------------ */
  function setupLogoFallback(imgId, textId) {
    var img = document.getElementById(imgId);
    var text = document.getElementById(textId);
    if (!img || !text) return;
    img.addEventListener('error', function () {
      img.style.display = 'none';
      text.style.display = 'block';
    });
  }

  setupLogoFallback('navLogo', 'navLogoText');
  setupLogoFallback('footerLogo', 'footerLogoText');

  /* ------------------------------------------------------------------ */
  /* Nav: fundo ao rolar + menu mobile                                   */
  /* ------------------------------------------------------------------ */
  var nav = document.getElementById('nav');
  var burger = document.querySelector('.nav__burger');
  var navMobile = document.getElementById('navMobile');

  function handleScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (burger && navMobile) {
    burger.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navMobile.hidden = !isOpen;
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navMobile.hidden = true;
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Fade-in ao rolar                                                     */
  /* ------------------------------------------------------------------ */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ accordion                                                        */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;

      document.querySelectorAll('.faq__question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });

  /* ------------------------------------------------------------------ */
  /* Formulário de aplicação → WhatsApp                                   */
  /* ------------------------------------------------------------------ */
  var form = document.getElementById('formAplicacao');

  var FATURAMENTO_LABELS = {
    'ate-15k': 'Até R$ 15.000',
    '15-30k': 'R$ 15.000 a R$ 30.000',
    '30-60k': 'R$ 30.000 a R$ 60.000',
    '60-100k': 'R$ 60.000 a R$ 100.000',
    'acima-100k': 'Acima de R$ 100.000'
  };

  function showError(group, message) {
    group.classList.add('has-error');
    var errorEl = group.querySelector('.form__error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(group) {
    group.classList.remove('has-error');
    var errorEl = group.querySelector('.form__error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateForm() {
    var valid = true;
    var requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(function (field) {
      var group = field.closest('.form__group');
      if (!group) return;

      if (!field.value.trim()) {
        showError(group, 'Este campo é obrigatório.');
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        showError(group, 'Informe um e-mail válido.');
        valid = false;
      } else {
        clearError(group);
      }
    });

    return valid;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateForm()) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      var label = submitBtn.querySelector('.btn__label');
      var loading = submitBtn.querySelector('.btn__loading');

      if (label && loading) {
        label.hidden = true;
        loading.hidden = false;
      }
      submitBtn.disabled = true;

      var data = new FormData(form);
      var nome = (data.get('nome') || '').trim();
      var crm = (data.get('crm') || '').trim();
      var email = (data.get('email') || '').trim();
      var telefone = (data.get('telefone') || '').trim();
      var especialidade = (data.get('especialidade') || '').trim();
      var faturamentoValue = data.get('faturamento') || '';
      var faturamento = FATURAMENTO_LABELS[faturamentoValue] || 'Não informado';
      var desafio = (data.get('desafio') || '').trim();

      var lines = [
        'Olá! Gostaria de me candidatar à *Mentoria Select*.',
        '',
        '*Nome:* ' + nome,
        '*CRM:* ' + crm,
        '*E-mail:* ' + email,
        '*WhatsApp:* ' + telefone,
        '*Especialidade:* ' + especialidade,
        '*Faturamento mensal:* ' + faturamento,
        '*Principal desafio:* ' + desafio
      ];

      var message = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;

      window.open(url, '_blank', 'noopener,noreferrer');

      if (label && loading) {
        label.hidden = false;
        loading.hidden = true;
      }
      submitBtn.disabled = false;
      form.reset();
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        var group = field.closest('.form__group');
        if (group && field.value.trim()) clearError(group);
      });
    });
  }
})();
