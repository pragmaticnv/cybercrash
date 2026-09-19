/* =====================================================
   CYBERCRASH — App Bootstrap & Form Wiring
   ===================================================== */

import { loginAsync } from './auth.js';
import { buildThreatMap } from './map.js';
import { initThreatGraph } from './threatGraph.js';
import { initParticles } from './particles.js';

document.addEventListener('DOMContentLoaded', () => {
  // ── Background layers ──────────────────────────────
  buildThreatMap();
  initParticles('cyber-background', 28);

  // ── Threat graph (small delay for layout) ─────────
  setTimeout(() => initThreatGraph('threat-graph-canvas'), 200);

  // ── Password toggle ────────────────────────────────
  const pwdInput  = document.getElementById('password-input');
  const pwdToggle = document.getElementById('pwd-toggle');
  const eyeIcon   = document.getElementById('eye-icon');

  if (pwdToggle && pwdInput) {
    pwdToggle.addEventListener('click', () => {
      const isHidden = pwdInput.type === 'password';
      pwdInput.type = isHidden ? 'text' : 'password';
      if (eyeIcon) {
        eyeIcon.innerHTML = isHidden
          ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
          : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
      }
    });
  }

  // ── Login form ─────────────────────────────────────
  const form        = document.getElementById('login-form');
  const userInput   = document.getElementById('userid-input');
  const errorEl     = document.getElementById('login-error');
  const errorText   = document.getElementById('login-error-text');
  const btnLabel    = document.getElementById('btn-label');
  const signinBtn   = document.getElementById('sign-in-btn');
  const successOvl  = document.getElementById('success-overlay');
  const successSub  = document.getElementById('success-sub');
  const cardWrapper = document.getElementById('card-wrapper-el');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userId   = userInput?.value.trim() || '';
      const password = pwdInput?.value || '';

      // Clear previous error
      if (errorEl) errorEl.classList.add('hidden');

      // Loading state
      if (signinBtn) { signinBtn.disabled = true; signinBtn.classList.add('loading'); }
      if (btnLabel) btnLabel.textContent = 'AUTHENTICATING…';

      const result = await loginAsync(userId, password);

      if (result.success) {
        // Show success overlay
        if (successOvl) successOvl.classList.add('visible');
        if (successSub) successSub.textContent = `Redirecting to ${result.label || 'Intelligence Portal'}…`;
        setTimeout(() => { window.location.href = result.portal; }, 900);

      } else {
        // Restore button
        if (signinBtn) { signinBtn.disabled = false; signinBtn.classList.remove('loading'); }
        if (btnLabel) btnLabel.textContent = 'SIGN IN';

        // Show error
        if (errorEl) errorEl.classList.remove('hidden');
        if (errorText) errorText.textContent = result.error || 'Invalid credentials. Use lea_demo / bank_demo / i4c_demo / admin_demo.';

        // Shake the wrapper
        if (cardWrapper) {
          cardWrapper.classList.add('shake');
          setTimeout(() => cardWrapper.classList.remove('shake'), 550);
        }
      }
    });
  }

  // ── Alt auth buttons ───────────────────────────────
  document.getElementById('aadhaar-btn')?.addEventListener('click', () => {
    alert('Aadhaar authentication is available for authorised agencies only.\nThis is a demo interface.');
  });

  document.getElementById('sso-btn')?.addEventListener('click', () => {
    alert('Government SSO integration is pending deployment.\nThis is a demo interface.');
  });

  // ── Forgot Password ────────────────────────────────
  document.getElementById('forgot-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset requires system administrator approval.\nContact: admin@cybercrash.gov.in');
  });

  // ── Register Now ──────────────────────────────────
  document.getElementById('register-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('New agency registration requires MHA approval.\nContact: admin@cybercrash.gov.in');
  });

  // ── Nav links ─────────────────────────────────────
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
    });
  });
});
