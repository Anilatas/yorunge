(() => {
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;

  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.className = 'nav-btn pwa-install-btn';
  installButton.textContent = '⇩';
  installButton.setAttribute('aria-label', 'Yörünge uygulamasını indir veya yükle');
  installButton.title = 'Uygulamayı indir veya yükle';
  nav.appendChild(installButton);

  let installPrompt = null;
  const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (isInstalled()) installButton.hidden = true;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.textContent = 'Uygulamayı yükle';
    installButton.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButton.hidden = true;
  });

  installButton.addEventListener('click', async () => {
    if (!installPrompt) {
      alert('Tarayıcı menüsünden “Yörünge uygulamasını yükle” veya “Ana ekrana ekle” seçeneğini kullanabilirsin. Yükleme için siteyi HTTPS üzerinden açmalısın.');
      return;
    }
    const prompt = installPrompt;
    installPrompt = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') installButton.hidden = true;
    } catch (error) {
      console.error('Uygulama yükleme penceresi açılamadı:', error);
      alert('Uygulama yükleme penceresi açılamadı. Tarayıcı menüsünden yüklemeyi deneyebilirsin.');
    }
  });

  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.register('./sw.js')
      .catch((error) => console.error('Çevrimdışı kullanım başlatılamadı:', error));
  }
})();
