(() => {
  const BACKUP_FORMAT = 'yorunge-backup';
  const BACKUP_VERSION = 1;
  const STORAGE_KEYS = [
    'yorunge-theme',
    'weekly_tasks',
    'weekly_tasks_history',
    'weekly_tasks_week_start',
    'weekly_task_templates',
    'weekly_subject_goals',
    'weekly_hidden_subject_goals',
    'weekly_progress_preferences',
    'pomo_profiles',
    'pomo_history',
    'pomo_active_profile',
    'pomo_alarm_volume',
    'pomo_timer_state_v1'
  ];
  const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;

  const brand = nav.querySelector('.brand-link');
  let closeToolsPanel = () => {};
  if (brand) {
    const wrapper = document.createElement('div');
    wrapper.className = 'brand-tools';
    const panel = document.createElement('div');
    panel.id = 'brandToolsPanel';
    panel.className = 'brand-tools-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Yörünge araçları');
    panel.hidden = true;

    const homeLink = document.createElement('a');
    homeLink.href = 'home.html';
    homeLink.className = 'brand-tools-home';
    homeLink.textContent = '⌂ Ana sayfa';
    panel.appendChild(homeLink);

    nav.insertBefore(wrapper, brand);
    wrapper.append(brand, panel);
    brand.setAttribute('aria-label', 'Yörünge araçları panelini aç');
    brand.setAttribute('aria-haspopup', 'true');
    brand.setAttribute('aria-controls', panel.id);
    brand.setAttribute('aria-expanded', 'false');

    const closePanel = () => {
      panel.hidden = true;
      brand.setAttribute('aria-expanded', 'false');
    };
    closeToolsPanel = closePanel;
    brand.addEventListener('click', (event) => {
      event.preventDefault();
      panel.hidden = !panel.hidden;
      brand.setAttribute('aria-expanded', String(!panel.hidden));
    });
    homeLink.addEventListener('click', closePanel);
    document.addEventListener('pointerdown', (event) => {
      if (!wrapper.contains(event.target)) closePanel();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        closePanel();
        brand.focus();
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      .brand-tools { position: relative; display: inline-flex; align-items: center; margin-right: 8px; }
      .brand-tools .brand-link { margin-right: 0; cursor: pointer; }
      .brand-tools-panel { position: absolute; z-index: 30; top: calc(100% + 10px); left: 0; display: grid; gap: 8px; width: min(270px, calc(100vw - 32px)); padding: 12px; border: 1px solid rgba(148,163,184,.24); border-radius: 14px; background: #fff; color: #0f172a; box-shadow: 0 16px 38px rgba(15,23,42,.2); }
      .brand-tools-panel[hidden] { display: none; }
      body[data-theme="dark"] .brand-tools-panel { border-color: rgba(148,163,184,.24); background: #0f172a; color: #f8fafc; }
      .brand-tools-home { display: block; padding: 8px 10px; border-radius: 9px; color: inherit; font-size: 13px; font-weight: 700; text-decoration: none; }
      .brand-tools-home:hover { background: rgba(148,163,184,.14); }
      .brand-tools-panel .nav-btn { width: 100%; justify-content: flex-start; background: rgba(148,163,184,.1); color: inherit; }
      .brand-tools-panel .nav-btn:hover, .brand-tools-home:hover { background: rgba(59,130,246,.13); }
      .pwa-install-btn { width: 42px; height: 42px; flex: 0 0 42px; margin-left: auto; padding: 0; border-radius: 12px; font-size: 22px; }
      .task-complete-btn { position: absolute; top: 7px; right: 7px; z-index: 3; display: grid; width: 22px; height: 22px; place-items: center; padding: 0; border: 1px solid rgba(71,85,105,.32); border-radius: 6px; background: rgba(255,255,255,.28); color: transparent; font-size: 16px; font-weight: 600; line-height: 1; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease; }
      .task-complete-btn:not([aria-pressed="true"]):hover { border-color: rgba(71,85,105,.62); background: rgba(148,163,184,.18); color: #64748b; }
      body[data-theme="dark"] .task-complete-btn:not([aria-pressed="true"]) { border-color: rgba(226,232,240,.4); background: rgba(15,23,42,.32); }
      .task-complete-btn[aria-pressed="true"] { border-color: transparent; background: transparent; color: #475569; box-shadow: none; }
      body[data-theme="dark"] .task-complete-btn[aria-pressed="true"] { color: #e2e8f0; }
      .task-complete-btn:focus-visible { outline: 2px solid #60a5fa; outline-offset: 1px; }
      .task-complete-btn:disabled { cursor: default; opacity: .65; }
      .task-item.is-completed .task-title { opacity: .86; }
      .task-item .task-main { padding-right: 28px; }
      .progress-grid[data-visible-count="3"] { grid-template-columns: repeat(3,minmax(0,1fr)); }
      .progress-grid[data-visible-count="4"] { grid-template-columns: repeat(4,minmax(0,1fr)); }
      .pwa-install-btn[hidden] { display: none; }
      .progress-controls { display: flex; flex-wrap: wrap; gap: 7px; }
      .progress-control { padding: 7px 10px; border: 1px solid rgba(148,163,184,.24); border-radius: 9px; background: rgba(37,99,235,.08); color: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
      .progress-customization { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-top: 12px; padding: 12px; border: 1px solid rgba(148,163,184,.18); border-radius: 12px; background: rgba(148,163,184,.06); }
      .progress-customization[hidden] { display: none; }
      .progress-customization label { display: inline-flex; align-items: center; gap: 6px; color: inherit; font-size: 12px; cursor: pointer; }
      .progress-customization input { accent-color: #2563eb; }
      [data-progress-item][hidden] { display: none !important; }
      .progress-grid[hidden] { display: none !important; }
      .progress-grid[data-visible-count="1"] { grid-template-columns: 1fr; }
      .progress-grid[data-visible-count="2"] { grid-template-columns: repeat(2, minmax(0,1fr)); }
    `;
    document.head.appendChild(style);
  }

  const exportButton = document.createElement('button');
  exportButton.type = 'button';
  exportButton.className = 'nav-btn';
  exportButton.textContent = '⬇ Yedek indir';
  exportButton.title = 'Program, notlar ve Pomodoro verilerini indirir. API anahtarı dahil edilmez.';

  const importButton = document.createElement('button');
  importButton.type = 'button';
  importButton.className = 'nav-btn';
  importButton.textContent = '⬆ Yedekten yükle';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json,application/json';
  fileInput.hidden = true;
  const menu = nav.querySelector('.brand-tools-panel');
  if (menu) menu.append(exportButton, importButton, fileInput);
  else nav.append(exportButton, importButton, fileInput);

  function parseJsonValue(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error('Yedek dosyasındaki veri geçerli JSON biçiminde değil.');
    }
  }

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isTaskWeek(value) {
    return isPlainObject(value)
      && DAYS.every((day) => Array.isArray(value[day]) && value[day].every((task) => (
        isPlainObject(task)
        && typeof task.title === 'string'
        && typeof task.start === 'string'
        && typeof task.end === 'string'
        && (task.completed === undefined || typeof task.completed === 'boolean')
      )));
  }

  function isValidStroke(stroke) {
    return isPlainObject(stroke)
      && typeof stroke.id === 'string'
      && typeof stroke.color === 'string'
      && Number.isFinite(stroke.width)
      && Array.isArray(stroke.points)
      && stroke.points.every((point) => isPlainObject(point) && Number.isFinite(point.x) && Number.isFinite(point.y));
  }

  function isImageDataUrl(value) {
    return typeof value === 'string' && /^data:image\/(?:png|jpeg|webp|gif|avif);base64,/i.test(value);
  }

  function isValidNote(note) {
    if (!isPlainObject(note) || typeof note.id !== 'string' || typeof note.title !== 'string' || typeof note.body !== 'string') return false;
    if (note.textStrokes !== undefined && (!Array.isArray(note.textStrokes) || !note.textStrokes.every(isValidStroke))) return false;
    if (note.photos !== undefined) {
      if (!Array.isArray(note.photos)) return false;
      if (!note.photos.every((photo) => (
        isPlainObject(photo)
        && typeof photo.id === 'string'
        && isImageDataUrl(photo.dataUrl)
        && (photo.strokes === undefined || (Array.isArray(photo.strokes) && photo.strokes.every(isValidStroke)))
      ))) return false;
    }
    return note.photo === undefined || isImageDataUrl(note.photo);
  }

  function validateStoredValue(key, value) {
    if (typeof value !== 'string') return false;
    if (key === 'yorunge-theme') return value === 'light' || value === 'dark';
    if (key === 'weekly_tasks_week_start') return /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (key === 'pomo_active_profile') return value.length > 0;
    if (key === 'pomo_alarm_volume') return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1;

    const parsed = parseJsonValue(value);
    if (key === 'weekly_tasks') return isTaskWeek(parsed);
    if (key === 'weekly_tasks_history') {
      return Array.isArray(parsed) && parsed.every((entry) => isPlainObject(entry)
        && /^\d{4}-\d{2}-\d{2}$/.test(entry.weekStart) && isTaskWeek(entry.tasks));
    }
    if (key === 'weekly_task_templates') {
      return Array.isArray(parsed) && parsed.every((entry) => isPlainObject(entry)
        && typeof entry.id === 'string' && typeof entry.name === 'string' && isTaskWeek(entry.tasks));
    }
    if (key === 'weekly_subject_goals') {
      return isPlainObject(parsed) && Object.values(parsed).every((goal) => Number.isFinite(goal) && goal >= 0 && goal <= 40);
    }
    if (key === 'weekly_hidden_subject_goals') {
      return Array.isArray(parsed) && parsed.every((subject) => typeof subject === 'string');
    }
    if (key === 'weekly_progress_preferences') {
      const progressItems = ['plannedStudy', 'completedStudy', 'focusedTime', 'focusedDays', 'focusRatio', 'subjectGoals'];
      return isPlainObject(parsed)
        && typeof parsed.collapsed === 'boolean'
        && isPlainObject(parsed.visible)
        && Object.entries(parsed.visible).every(([item, visible]) => progressItems.includes(item) && typeof visible === 'boolean');
    }
    if (key === 'pomo_profiles') return isPlainObject(parsed);
    if (key === 'pomo_history') return Array.isArray(parsed) && parsed.every(isPlainObject);
    if (key === 'pomo_timer_state_v1') {
      return isPlainObject(parsed)
        && typeof parsed.profile === 'string'
        && ['work', 'short', 'long'].includes(parsed.mode)
        && Number.isFinite(parsed.remainingSeconds)
        && typeof parsed.isRunning === 'boolean'
        && Number.isFinite(parsed.elapsedSeconds);
    }
    return false;
  }

  function openNotesDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ders-asist-notes', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('notes')) {
          request.result.createObjectStore('notes', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Not veritabanı açılamadı.'));
    });
  }

  async function getNotes() {
    const database = await openNotesDatabase();
    try {
      return await new Promise((resolve, reject) => {
        const request = database.transaction('notes', 'readonly').objectStore('notes').getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('Notlar yedeklenemedi.'));
      });
    } finally {
      database.close();
    }
  }

  async function replaceNotes(notes) {
    const database = await openNotesDatabase();
    try {
      await new Promise((resolve, reject) => {
        const transaction = database.transaction('notes', 'readwrite');
        const store = transaction.objectStore('notes');
        store.clear();
        notes.forEach((note) => store.put(note));
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('Notlar geri yüklenemedi.'));
        transaction.onabort = () => reject(transaction.error || new Error('Not geri yükleme işlemi iptal edildi.'));
      });
    } finally {
      database.close();
    }
  }

  async function exportBackup() {
    const localStorageData = {};
    STORAGE_KEYS.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) localStorageData[key] = value;
    });
    const backup = {
      format: BACKUP_FORMAT,
      version: BACKUP_VERSION,
      createdAt: new Date().toISOString(),
      localStorage: localStorageData,
      notes: await getNotes()
    };
    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `yorunge-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    alert('Yedek dosyası indirildi. API anahtarı güvenlik için yedeğe dahil edilmedi.');
  }

  function validateBackup(backup) {
    if (!isPlainObject(backup) || backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION) {
      throw new Error('Bu dosya desteklenen bir Yörünge yedeği değil.');
    }
    if (!isPlainObject(backup.localStorage) || !Array.isArray(backup.notes) || !backup.notes.every(isValidNote)) {
      throw new Error('Yedek dosyasının içeriği geçersiz veya eksik.');
    }
    Object.entries(backup.localStorage).forEach(([key, value]) => {
      if (!STORAGE_KEYS.includes(key) || !validateStoredValue(key, value)) {
        throw new Error(`Yedek dosyasındaki “${key}” verisi doğrulanamadı.`);
      }
    });
    return backup;
  }

  function restoreLocalStorage(values) {
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    Object.entries(values).forEach(([key, value]) => localStorage.setItem(key, value));
  }

  async function restoreBackup(file) {
    const backup = validateBackup(parseJsonValue(await file.text()));
    if (!window.confirm('Bu işlem mevcut program, not ve Pomodoro verilerinin yerini yedekteki verilerle değiştirecek. Önce mevcut verilerini yedeklediğinden emin misin?')) return;

    const previousStorage = {};
    STORAGE_KEYS.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) previousStorage[key] = value;
    });
    const previousNotes = await getNotes();

    try {
      await replaceNotes(backup.notes);
      restoreLocalStorage(backup.localStorage);
    } catch (error) {
      try {
        await replaceNotes(previousNotes);
        restoreLocalStorage(previousStorage);
      } catch (rollbackError) {
        console.error('Yedek geri yükleme geri alınamadı:', rollbackError);
        throw new Error(`Geri yükleme başarısız oldu ve geri alma da tamamlanamadı: ${error.message}`);
      }
      throw error;
    }

    alert('Yedek başarıyla yüklendi. Sayfa yeni verilerle açılacak.');
    window.location.reload();
  }

  exportButton.addEventListener('click', () => {
    closeToolsPanel();
    exportBackup().catch((error) => {
      console.error('Yedek oluşturulamadı:', error);
      alert(`Yedek oluşturulamadı: ${error.message}`);
    });
  });
  importButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    closeToolsPanel();
    restoreBackup(file).catch((error) => {
      console.error('Yedek yüklenemedi:', error);
      alert(`Yedek yüklenemedi: ${error.message}`);
    }).finally(() => {
      fileInput.value = '';
    });
  });
})();
