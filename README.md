# Yörünge

Ders çalışmayı daha planlı ve verimli hale getir. Yörünge; haftalık program, soru çözücü, zengin ders notları ve Pomodoro araçlarını bir araya getirerek kendi çalışma düzenini kurmana yardımcı olur.

**Farklı araçlarla kendi ders çalışma yörüngeni oluştur.**

## Özellikler

- Haftalık çalışma programı, geçmiş hafta arşivi ve tekrar kullanılabilir şablonlar
- Program etkinliklerini tikleyerek tamamlanma durumunu ve haftalık ilerlemeyi takip etme
- Programa bağlı ders hedeflerinin yanında kişisel hedef ekleme ve kaldırma
- Fotoğraf ve çizim destekli ders notları
- Pomodoro zamanlayıcısı ve çalışma geçmişi
- JSON yedekleme ve geri yükleme
- HTTPS üzerinde yüklenebilir ve çevrimdışı açılabilir PWA
- Soru çözüm asistanı

## Çalıştırma

`home.html` giriş sayfasını bir tarayıcıda açabilir veya GitHub Pages gibi statik bir barındırma hizmetinde yayımlayabilirsin. Soru çözücü `index.html` adresinde bulunur.

Program ve Pomodoro verileri tarayıcının yerel depolama alanında, ders notları ise IndexedDB'de tutulur. Veriler hesaplar veya cihazlar arasında otomatik olarak eşitlenmez; yedekleme ve geri yükleme seçeneklerine Yörünge başlığına tıklayarak ulaşabilirsin. Uygulama yükleme simgesi gezinme çubuğunun sağındadır. Yedek dosyası API anahtarını içermez. Haftalık ilerleme bölümünü daraltabilir ve **Özelleştir** düğmesiyle göstergeleri seçebilirsin. Uygulama verileri yalnızca cihazında saklar; çevrimdışı kullanım için siteyi en az bir kez çevrimiçiyken aç.
