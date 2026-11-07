'use strict';
(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open', !expanded);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  const estimateForm = document.querySelector('[data-estimate-form]');
  if (estimateForm) {
    const output = document.querySelector('[data-estimate-output]');
    const hoursOutput = document.querySelector('[data-estimate-hours]');
    const summaryOutput = document.querySelector('[data-estimate-summary]');
    const services = { closet: { name: 'Closet refresh', hours: 3 }, kitchen: { name: 'Kitchen reset', hours: 5 }, home: { name: 'Whole-home plan', hours: 8 } };
    const update = () => {
      const service = services[estimateForm.elements.service.value] || services.closet;
      const spaces = Math.max(1, Math.min(5, Number(estimateForm.elements.spaces.value) || 1));
      const pace = estimateForm.elements.pace.value === 'deep' ? 1.4 : 1;
      const hours = Math.round(service.hours * spaces * pace * 10) / 10;
      const lower = Math.round(hours * 45 / 5) * 5;
      const upper = Math.round(hours * 65 / 5) * 5;
      output.textContent = '$' + lower.toLocaleString() + '–$' + upper.toLocaleString();
      hoursOutput.textContent = hours + ' estimated hours';
      summaryOutput.textContent = service.name + ' · ' + spaces + ' ' + (spaces === 1 ? 'space' : 'spaces') + ' · ' + (pace > 1 ? 'Deep reset' : 'Light refresh');
    };
    estimateForm.addEventListener('input', update);
    update();
  }

  const contactForm = document.querySelector('[data-inquiry-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = contactForm.elements.name.value.trim();
      const email = contactForm.elements.email.value.trim();
      const service = contactForm.elements.service.value;
      const message = contactForm.elements.message.value.trim();
      const status = document.querySelector('[data-copy-status]');
      if (!contactForm.reportValidity()) return;
      const text = `TIDY GROVE — DEMONSTRATION INQUIRY\nName: ${name}\nEmail: ${email}\nInterest: ${service}\nMessage: ${message}`;
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = 'Inquiry copied. This demo does not send or store messages.';
      } catch (err) {
        const output = document.querySelector('[data-copy-fallback]');
        output.value = text;
        output.classList.remove('hidden');
        output.focus();
        output.select();
        status.textContent = 'Copy the selected text below. This demo does not send or store messages.';
      }
    });
  }
})();
