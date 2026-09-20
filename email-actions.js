export const EMAIL_ADDRESS = 'dogukannakin@gmail.com';

export const buildMailtoUrl = (email) => `mailto:${email}`;

export async function copyEmailToClipboard({
  email = EMAIL_ADDRESS,
  clipboard,
  onFallback,
} = {}) {
  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(email);
      return { copied: true, fallback: false };
    } catch {
      // Fall through to the mail client when clipboard permission is denied.
    }
  }

  onFallback?.(buildMailtoUrl(email));
  return { copied: false, fallback: true };
}

const translate = (key, fallback) => window.portfolioI18n?.t(key) || fallback;

const initializeEmailCopy = () => {
  const button = document.querySelector('[data-copy-email]');
  const status = document.querySelector('#copy-email-status');
  if (!button || !status) return;

  const setStatus = (key, fallback) => {
    status.textContent = translate(key, fallback);
  };

  button.addEventListener('click', async () => {
    const result = await copyEmailToClipboard({
      email: button.dataset.email || EMAIL_ADDRESS,
      clipboard: navigator.clipboard,
      onFallback: (mailtoUrl) => {
        window.location.href = mailtoUrl;
      },
    });

    if (result.copied) {
      setStatus('contact.emailCopied', 'Copied');
      return;
    }

    setStatus('contact.copyFallback', 'Opening your email app…');
  });
};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeEmailCopy();
}
