/**
 * SERAT ULEM PAWIWAHAN AGENG ADAT JAWA
 * Skrip Utama: Kontrol Musik Gending Kebo Giro, Animasi Wayang Rama & Shinta,
 * Pintu Gunungan, Galeri Prewedding Lightbox, RSVP LocalStorage, Countdown, dan Partikel Sekar Melati.
 */

(function () {
  'use strict';

  // --- 1. INISIALISASI AUDIO GENDING KEBO GIRO ---
  const audio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('floating-music-toggle');
  const musicBadge = document.getElementById('music-title-badge');
  let isAudioPlaying = false;

  function updateMusicUI(playing) {
    isAudioPlaying = playing;
    if (musicToggle) {
      if (playing) {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Jeda Gending Kebo Giro');
        musicToggle.setAttribute('title', 'Jeda Gending Kebo Giro');
      } else {
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Putar Gending Kebo Giro');
        musicToggle.setAttribute('title', 'Putar Gending Kebo Giro');
      }
    }
    if (musicBadge && playing) {
      musicBadge.classList.add('show');
      setTimeout(() => {
        musicBadge.classList.remove('show');
      }, 4000);
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.volume = 0.8;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateMusicUI(true);
        })
        .catch(() => {
          // Autoplay dibatasi oleh browser, menunggu interaksi pengguna
          updateMusicUI(false);
        });
    }
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    updateMusicUI(false);
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  // Coba putar langsung saat halaman pertama kali dimuat
  window.addEventListener('DOMContentLoaded', () => {
    playAudio();
  });

  // Pasang listener pada tombol musik melayang
  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // --- 2. LAYAR PEMBUKA & BUKA GERBANG GUNUNGAN ---
  const cover = document.getElementById('invitation-cover');
  const btnOpen = document.getElementById('btn-open-invitation');
  const mainStage = document.getElementById('main-stage');

  function openInvitation() {
    if (!cover) return;

    // Pastikan musik Gending Kebo Giro langsung berputar begitu tombol diklik
    playAudio();

    // Buka gerbang gunungan dengan animasi CSS
    cover.classList.add('opened');

    // Aktifkan theater wayang
    const theater = document.getElementById('wayang-theater');
    if (theater) {
      setTimeout(() => {
        theater.classList.add('sungkem-active');
        setTimeout(() => {
          theater.classList.remove('sungkem-active');
        }, 3200);
      }, 1000);
    }

    // Scroll halus ke panggung utama setelah gerbang terbuka
    setTimeout(() => {
      if (mainStage) {
        mainStage.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }

  if (btnOpen) {
    btnOpen.addEventListener('click', openInvitation);
  }

  // Jika tamu mengetuk sembarang area cover sebelum tombol, mulai audio
  if (cover) {
    cover.addEventListener('click', () => {
      if (!cover.classList.contains('opened')) {
        playAudio();
      }
    });
  }

  // --- 3. PARAMETER URL NAMA TAMU (URL QUERY STRING ?to=...) ---
  function populateGuestName() {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('to') || params.get('u') || params.get('guest');
    const guestEl = document.getElementById('cover-guest-name');
    const rsvpNameInput = document.getElementById('rsvp-name');

    if (guestParam && guestEl) {
      // Bersihkan teks untuk keamanan
      const cleanName = guestParam.replace(/[<>]/g, '').trim();
      if (cleanName.length > 0) {
        guestEl.textContent = cleanName;
        if (rsvpNameInput) {
          rsvpNameInput.value = cleanName;
        }
      }
    }
  }
  populateGuestName();

  // --- 4. INTERAKSI ANIMASI WAYANG RAMA & SINTA ---
  const theater = document.getElementById('wayang-theater');
  const btnSungkem = document.getElementById('btn-wayang-sungkem');
  const btnReplay = document.getElementById('btn-wayang-replay');

  if (btnSungkem && theater) {
    btnSungkem.addEventListener('click', () => {
      theater.classList.toggle('sungkem-active');
      const isSungkem = theater.classList.contains('sungkem-active');
      btnSungkem.innerHTML = isSungkem
        ? '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg> Tegak Kembali'
        : '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Haturkan Sembah';
    });
  }

  if (btnReplay && theater) {
    btnReplay.addEventListener('click', () => {
      theater.classList.remove('sungkem-active');
      const rama = document.querySelector('.wayang-actor-rama');
      const shinta = document.querySelector('.wayang-actor-shinta');

      if (rama && shinta) {
        rama.style.animation = 'none';
        shinta.style.animation = 'none';
        // Force reflow
        void rama.offsetWidth;
        void shinta.offsetWidth;
        rama.style.animation = '';
        shinta.style.animation = '';
      }
    });
  }

  // --- 5. DOKUMENTASI PREWEDDING & LIGHTBOX MODAL ---
  const prewedData = [
    {
      img: 'assets/images/prewed-1.svg',
      title: 'Romansa Balairung Keraton',
      desc: 'Potret agung kanthi busana basahan keprabon ing plataran Kraton Ngayogyakarta.'
    },
    {
      img: 'assets/images/prewed-2.svg',
      title: 'Kusuma ing Wanadadi',
      desc: 'Swasana asri lan ayem ing madyaning taman pinus mawi busana kebaya beludru soga.'
    },
    {
      img: 'assets/images/prewed-3.svg',
      title: 'Janji Suci Pelataran Candi',
      desc: 'Janji setya tuhu ing sangandhaping megahing candi mawi busana kanigaran emas.'
    },
    {
      img: 'assets/images/prewed-4.svg',
      title: 'Gandrung Asmaradana',
      desc: 'Crita katresnan prasaja mawi lurik Mataraman tradisional ing pelataran Tamansari.'
    },
    {
      img: 'assets/images/prewed-5.svg',
      title: 'Lelampahan Taman Sari',
      desc: 'Sorot surya sore ing Pasanggrahan Banyu Sumur kanthi paes ageng klasik adiluhung.'
    },
    {
      img: 'assets/images/prewed-6.svg',
      title: 'Nyawiji ing Katresnan',
      desc: 'Potret studio soga klasik kanthi latar kain batik parang rusak barong kencana.'
    }
  ];

  let currentPhotoIndex = 0;
  const lightbox = document.getElementById('prewed-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const galleryCards = document.querySelectorAll('.gallery-card');

  function openLightbox(index) {
    if (!lightbox || !prewedData[index]) return;
    currentPhotoIndex = index;
    const photo = prewedData[index];
    lightboxImg.src = photo.img;
    lightboxImg.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDesc.textContent = photo.desc;
    lightboxCounter.textContent = `Foto ${index + 1} saka ${prewedData.length}`;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showPrevPhoto() {
    const newIndex = (currentPhotoIndex - 1 + prewedData.length) % prewedData.length;
    openLightbox(newIndex);
  }

  function showNextPhoto() {
    const newIndex = (currentPhotoIndex + 1) % prewedData.length;
    openLightbox(newIndex);
  }

  galleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrevPhoto();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextPhoto();
    });
  }

  // Keyboard navigation untuk Lightbox (Escape, ArrowLeft, ArrowRight)
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    }
  });

  // --- 6. COUNTDOWN TIMER MENUJU AKAD NIKAH ---
  function initCountdown() {
    // Tanggal Acara: 24 Oktober 2026, Pukul 08:00:00 WIB
    const eventDate = new Date('2026-10-24T08:00:00+07:00').getTime();

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minutesEl = document.getElementById('count-minutes');
    const secondsEl = document.getElementById('count-seconds');

    function update() {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // --- 7. BUKU TAMU & RSVP (LOCALSTORAGE PERSISTENCE) ---
  const STORAGE_KEY = 'jawa_wedding_wishes';
  const rsvpForm = document.getElementById('rsvp-form');
  const wishesList = document.getElementById('wishes-list');
  const filterButtons = document.querySelectorAll('.wishes-filter-btn');
  let currentFilter = 'all';

  const defaultWishes = [
    {
      name: 'Ki Dalang Warsito & Keluarga',
      status: 'hadir',
      pax: '4',
      session: 'Sedaya Adicara',
      message: 'Ndherek mangayubagya awit dhauping Raden Rama Wijaya kaliyan Dewi Shinta. Mugi tansah pinaringan karaharjan, guyub rukun kados mimi lan mintuna dumugi puputing yuswa.',
      time: '1 jam yang lalu'
    },
    {
      name: 'Eyang Brotosuryo',
      status: 'hadir',
      pax: '2',
      session: 'Akad Nikah Kemawon',
      message: 'Rahayu rahayu sagung dumadi. Mugi Gusti Ingkang Maha Wikan paring berkah ingkang melimpah dhateng temanten sarimbit. Dados kulawarga ingkang tentrem lan berkahi.',
      time: '3 jam yang lalu'
    },
    {
      name: 'Sedherek saking Ngayogyakarta',
      status: 'hadir',
      pax: '2',
      session: 'Resepsi Kemawon',
      message: 'Sugeng ambal warsa palakrama. Mugi langgeng tresnanipun, dados tuladha kautaman lan kasabaran kados lelampahaning Sri Rama lan Kusuma Dewi Shinta.',
      time: '5 jam yang lalu'
    }
  ];

  function getStoredWishes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Gagal membaca data ucapan:', e);
    }
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.error('Gagal menyimpan data ucapan:', e);
    }
  }

  function updateRsvpStats(wishes) {
    const statHadirEl = document.getElementById('stat-hadir-count');
    const statRaguEl = document.getElementById('stat-ragu-count');
    const statTidakEl = document.getElementById('stat-tidak-count');

    let totalHadirPax = 0;
    let totalRagu = 0;
    let totalTidak = 0;

    wishes.forEach((w) => {
      const paxCount = parseInt(w.pax, 10) || 1;
      if (w.status === 'hadir') {
        totalHadirPax += paxCount;
      } else if (w.status === 'ragu') {
        totalRagu += 1;
      } else if (w.status === 'tidak-hadir') {
        totalTidak += 1;
      }
    });

    if (statHadirEl) statHadirEl.textContent = String(totalHadirPax);
    if (statRaguEl) statRaguEl.textContent = String(totalRagu);
    if (statTidakEl) statTidakEl.textContent = String(totalTidak);
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getStoredWishes();
    updateRsvpStats(wishes);

    const filtered = wishes.filter((item) => {
      if (currentFilter === 'all') return true;
      return item.status === currentFilter;
    });

    wishesList.innerHTML = '';

    if (filtered.length === 0) {
      wishesList.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--soga-light); font-style: italic;">
          Dereng wonten ucapan utawi konfirmasi ing kategori menika.
        </div>
      `;
      return;
    }

    filtered.forEach((item) => {
      const wishEl = document.createElement('div');
      wishEl.className = 'wish-item';

      let statusBadge = '';
      if (item.status === 'hadir') {
        statusBadge = '<span class="wish-status status-hadir">Hadir</span>';
      } else if (item.status === 'ragu') {
        statusBadge = '<span class="wish-status status-ragu">Taksih Ragu</span>';
      } else {
        statusBadge = '<span class="wish-status status-tidak-hadir">Berhalangan</span>';
      }

      const paxBadge = item.pax
        ? `<span class="wish-pax-badge">${escapeHtml(item.pax)} Tamu</span>`
        : '';

      const sessionBadge = item.session
        ? `<span class="wish-pax-badge" style="background: rgba(39, 20, 12, 0.08);">${escapeHtml(item.session)}</span>`
        : '';

      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          <div class="wish-badges">
            ${statusBadge}
            ${paxBadge}
            ${sessionBadge}
          </div>
        </div>
        <p class="wish-text">${escapeHtml(item.message)}</p>
        <span class="wish-time">${escapeHtml(item.time)}</span>
      `;
      wishesList.appendChild(wishEl);
    });
  }

  function escapeHtml(string) {
    if (!string) return '';
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
  }

  // Filter Tabs Event Listeners
  if (filterButtons && filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentFilter = btn.getAttribute('data-filter') || 'all';
        renderWishes();
      });
    });
  }

  // Submit RSVP Form
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const status = document.getElementById('rsvp-attendance').value;
      const pax = document.getElementById('rsvp-pax').value;
      const session = document.getElementById('rsvp-session').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name || !message) {
        showToast('Nyuwun tulung isi nama lan pandonga panjenengan');
        return;
      }

      const newWish = {
        name: name,
        status: status,
        pax: pax,
        session: session,
        message: message,
        time: 'Nembe kemawon (Baru saja)'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish);
      saveWishes(wishes);
      renderWishes();

      rsvpForm.reset();
      const paxSelect = document.getElementById('rsvp-pax');
      if (paxSelect) paxSelect.value = '2';
      const attendSelect = document.getElementById('rsvp-attendance');
      if (attendSelect) attendSelect.value = 'hadir';

      showToast('Matur nuwun, konfirmasi lan pandonga panjenengan sampun katampi!');
    });
  }

  renderWishes();

  // --- 8. TALI ASIH (SALIN NOMOR REKENING) ---
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast-notice');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetNumber = btn.getAttribute('data-account');
      if (targetNumber) {
        navigator.clipboard.writeText(targetNumber)
          .then(() => {
            showToast('Nomor rekening ' + targetNumber + ' kasil dipunsalin!');
          })
          .catch(() => {
            showToast('Kasil dipunsalin: ' + targetNumber);
          });
      }
    });
  });

  // --- 9. PARTIKEL SAWUR SEKAR MELATI (CANVAS PETALS) ---
  const canvas = document.getElementById('flower-canvas');
  const petalToggle = document.getElementById('floating-petal-toggle');
  let isPetalActive = true;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petals = [];
    const petalCount = 28;

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 5 + Math.random() * 8,
        speedX: -0.8 + Math.random() * 1.6,
        speedY: 0.8 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: -0.02 + Math.random() * 0.04,
        opacity: 0.35 + Math.random() * 0.45
      });
    }

    function renderPetals() {
      if (!isPetalActive) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.angularSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        // Bentuk kelopak melati putih kekuningan
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 252, 242, ${p.opacity})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderPetals);
    }

    requestAnimationFrame(renderPetals);

    if (petalToggle) {
      petalToggle.addEventListener('click', () => {
        isPetalActive = !isPetalActive;
        petalToggle.style.opacity = isPetalActive ? '1' : '0.5';
        if (isPetalActive) {
          requestAnimationFrame(renderPetals);
          showToast('Efek sawur sekar melati aktif');
        } else {
          ctx.clearRect(0, 0, width, height);
          showToast('Efek sawur sekar melati dipunlereni');
        }
      });
    }
  }

})();
