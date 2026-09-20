(() => {
  const root = document.documentElement;
  const themeKey = 'theme';
  const themeToggle = document.querySelector('#theme-toggle');
  const themeLabel = themeToggle?.querySelector('[data-theme-label]');
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)');

  const translate = (key, fallback) => window.portfolioI18n?.t(key) || fallback;

  const updateThemeControl = (isDark) => {
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        translate(isDark ? 'theme.switchToLight' : 'theme.switchToDark', isDark ? 'Switch to light mode' : 'Switch to dark mode'),
      );
    }
    if (themeLabel) {
      themeLabel.textContent = translate(isDark ? 'theme.lightLabel' : 'theme.darkLabel', isDark ? 'Light' : 'Dark');
    }
  };

  const readStoredTheme = () => {
    try {
      const stored = window.localStorage.getItem(themeKey);
      return stored === 'dark' || stored === 'light' ? stored : null;
    } catch {
      return null;
    }
  };

  const systemTheme = () => (systemPreference.matches ? 'dark' : 'light');

  const applyTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    if (persist) {
      try {
        window.localStorage.setItem(themeKey, theme);
      } catch {
        // Theme still works when storage is unavailable.
      }
    }

    const isDark = theme === 'dark';
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
    }
    updateThemeControl(isDark);

    document.querySelectorAll('meta[name="theme-color"]').forEach((themeMeta) => {
      themeMeta.setAttribute('content', isDark ? '#171a1c' : '#f3eee7');
    });
  };

  applyTheme(readStoredTheme() || systemTheme());

  window.addEventListener('portfolio:language-changed', () => {
    updateThemeControl(root.dataset.theme === 'dark');
  });

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  const followSystemTheme = (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? 'dark' : 'light');
  };
  systemPreference.addEventListener?.('change', followSystemTheme);
  systemPreference.addListener?.(followSystemTheme);

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav?.setAttribute('data-open', String(!isOpen));
  });

  siteNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle?.setAttribute('aria-expanded', 'false');
      siteNav.removeAttribute('data-open');
    });
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
