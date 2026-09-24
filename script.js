/* =========================================================
   🎁 BIRTHDAY SURPRISE - CONFIGURATION & APPLICATION ENGINE
   All data can be customized directly in the config below!
   ========================================================= */

const SURPRISE_CONFIG = {
  // 1. Recipient Details
  recipientName: "Lijo",
  tagline: "💌 A Very Special Surprise Just For You",
  subtitle: "Lijo, someone who loves you dearly wrapped up a little world of joy, laughter, and the warmest wishes just for your big day. Tap the gift box to begin! 🎁",

  // 2. Audio Configuration
  // Put your own MP3 file in assets/ (e.g. "assets/birthday.mp3") and set path here.
  // If left empty or file is not found, it seamlessly falls back to our magical music-box chime synthesizer!
  customAudioSrc: "assets/birthday.mp3",

  // 3. Balloon Messages (Phase 1) — personalized for Lijo
  balloons: [
    { title: "Your Big Heart 💖",       subtitle: "You love deeply and it shows in everything", color1: "#ff5e7e", color2: "#ff758c" },
    { title: "That Smile 😊",           subtitle: "Lijo, your smile is literally contagious!", color1: "#ffbe3d", color2: "#f6e58d" },
    { title: "Your Patience 🌿",        subtitle: "Steady, calm, and always so thoughtful", color1: "#2ed573", color2: "#7bed9f" },
    { title: "Endless Energy ⚡",       subtitle: "You make every moment lively and fun", color1: "#48cae4", color2: "#00b4d8" },
    { title: "Loyal to the Core 🤝",    subtitle: "A friend like you is one in a billion", color1: "#c56cf0", color2: "#7d5fff" },
    { title: "Pure Good Vibes ✨",      subtitle: "Wherever you go, joy follows!", color1: "#ff6b81", color2: "#ff4757" }
  ],

  // 4. Special Message (Revealed after all balloons are burst)
  balloonReveal: {
    title: "Lijo, You Are Truly Wonderful! 💖",
    body: "Every single pop was a little reminder of all the reasons you are so incredibly special. The world is a brighter, warmer, more beautiful place because you are in it. Now close your eyes for a second... make a deep breath, and get ready for your birthday wish! 🎂"
  },

  // 5. Cake Scene Texts
  cakeScene: {
    title: "Make Your Biggest Birthday Wish, Lijo! 🌟",
    instruction: "Take a deep breath and blow out the candle! 🎙️ Or simply tap the flame to make your wish come true!"
  },

  // 6. Sweet Memories (Phase 3)
  // Upload your own photos into assets/ (e.g., assets/memory1.jpg, assets/memory2.jpg)
  memories: [
    {
      src: "assets/memory1.jpg",
      caption: "Lijo, this one always makes me smile 🌅💛",
      fallbackText: "Sweet Memory • Photo 1"
    },
    {
      src: "assets/memory2.jpg",
      caption: "Every moment with you is a memory I treasure ✨🎂",
      fallbackText: "Sweet Memory • Photo 2"
    }
  ],

  // 7. Handwritten "Missing You" Letter from Anisha to Lijo
  missingLetter: {
    salutation: "My dearest",
    paragraphs: [
      "Happy Birthday, Lijo! 🎉🎂 Wishing you the most wonderful, beautiful day — you deserve every bit of happiness this world has to offer.",
      "I keep going back to all the memories we've made together and every single one of them makes my heart so full. You have this rare, beautiful way of making people feel genuinely seen and cared for. That is one of the most beautiful things about you, Lijo.",
      "I'm missing you a lot on your special day. Distance or time can never change how much you mean to me — you're someone I'm truly grateful to have in my life. I'm sending you the biggest, warmest, most heartfelt virtual hug across every mile between us! 🤗💕",
      "May this brand new year of your life bring you everything you have been quietly hoping and praying for. May your mornings be peaceful, your laughs be loud, your dreams be bold, and your heart be full of the love you so generously give to everyone around you. You deserve it all, Lijo — and so much more."
    ],
    signoff: "Yours always, with so much love —",
    signature: "Anisha 💖"
  }
};


/* =========================================================
   APPLICATION ENGINE
   ========================================================= */
(() => {
  'use strict';

  // State Management
  const state = {
    currentScene: 'sceneLanding',
    musicPlaying: false,
    soundFxEnabled: true,
    poppedCount: 0,
    totalBalloons: SURPRISE_CONFIG.balloons.length,
    candleBlown: false,
    audioCtx: null,
    micStream: null,
    micAnalyser: null,
    micDataArray: null,
    micAnimId: null,
    blowThresholdCount: 0,
    synthLoopTimer: null,
    isUsingCustomAudio: false
  };

  // DOM Cache
  const el = {
    // Header & Navigation
    journeySteps: document.querySelectorAll('.journey-step'),
    musicToggleBtn: document.getElementById('musicToggleBtn'),
    musicStatusText: document.getElementById('musicStatusText'),
    particleCanvas: document.getElementById('particleCanvas'),
    ambientStars: document.getElementById('ambientStars'),

    // Scenes
    sceneLanding: document.getElementById('sceneLanding'),
    sceneBalloons: document.getElementById('sceneBalloons'),
    sceneCake: document.getElementById('sceneCake'),
    sceneMemories: document.getElementById('sceneMemories'),

    // Scene 1
    cfgTagline: document.getElementById('cfgTagline'),
    displayRecipientName: document.getElementById('displayRecipientName'),
    cfgSubtitle: document.getElementById('cfgSubtitle'),
    giftBoxTrigger: document.getElementById('giftBoxTrigger'),
    giftLid: document.getElementById('giftLid'),

    // Scene 2
    balloonArena: document.getElementById('balloonArena'),
    balloonProgressFill: document.getElementById('balloonProgressFill'),
    balloonStats: document.getElementById('balloonStats'),
    specialMessageModal: document.getElementById('specialMessageModal'),
    revealTitle: document.getElementById('revealTitle'),
    balloonMessageText: document.getElementById('balloonMessageText'),
    goToCakeBtn: document.getElementById('goToCakeBtn'),

    // Scene 3
    cakeTitle: document.getElementById('cakeTitle'),
    candleInstruction: document.getElementById('candleInstruction'),
    candleTrigger: document.getElementById('candleTrigger'),
    candleFlame: document.getElementById('candleFlame'),
    smokeGroup: document.getElementById('smokeGroup'),
    micStatusCard: document.getElementById('micStatusCard'),
    micHalo: document.getElementById('micHalo'),
    micStatusLabel: document.getElementById('micStatusLabel'),
    micMeterFill: document.getElementById('micMeterFill'),
    enableMicBtn: document.getElementById('enableMicBtn'),
    blowCandleManualBtn: document.getElementById('blowCandleManualBtn'),
    cakeActionCard: document.getElementById('cakeActionCard'),
    cakeCelebrationCard: document.getElementById('cakeCelebrationCard'),
    countdownBarFill: document.getElementById('countdownBarFill'),
    countdownNumber: document.getElementById('countdownNumber'),
    skipToMemoriesBtn: document.getElementById('skipToMemoriesBtn'),

    // Scene 4
    polaroid1: document.getElementById('polaroid1'),
    polaroid2: document.getElementById('polaroid2'),
    memoryImg1: document.getElementById('memoryImg1'),
    memoryImg2: document.getElementById('memoryImg2'),
    memoryCaption1: document.getElementById('memoryCaption1'),
    memoryCaption2: document.getElementById('memoryCaption2'),
    letterSalutation: document.getElementById('letterSalutation'),
    letterRecipientName: document.getElementById('letterRecipientName'),
    letterParagraphsContainer: document.getElementById('letterParagraphsContainer'),
    letterSignoffText: document.getElementById('letterSignoffText'),
    letterSignatureText: document.getElementById('letterSignatureText'),
    replaySurpriseBtn: document.getElementById('replaySurpriseBtn'),

    // Modals
    imageModal: document.getElementById('imageModal'),
    modalImg: document.getElementById('modalImg'),
    modalCaption: document.getElementById('modalCaption'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    toastNotification: document.getElementById('toastNotification'),
    customAudio: document.getElementById('customAudio')
  };

  // --- Initialize App ---
  function init() {
    populateConfigContent();
    createAmbientStars();
    setupCanvas();
    setupEventListeners();
    renderBalloons();
  }

  // --- Populate UI from SURPRISE_CONFIG ---
  function populateConfigContent() {
    // 1. Recipient & Subtitles
    if (el.displayRecipientName) el.displayRecipientName.textContent = SURPRISE_CONFIG.recipientName;
    if (el.cfgTagline) el.cfgTagline.textContent = SURPRISE_CONFIG.tagline;
    if (el.cfgSubtitle) el.cfgSubtitle.textContent = SURPRISE_CONFIG.subtitle;

    // 2. Balloon reveal texts
    if (el.revealTitle) el.revealTitle.textContent = SURPRISE_CONFIG.balloonReveal.title;
    if (el.balloonMessageText) el.balloonMessageText.textContent = SURPRISE_CONFIG.balloonReveal.body;

    // 3. Cake scene texts
    if (el.cakeTitle) el.cakeTitle.textContent = SURPRISE_CONFIG.cakeScene.title;
    if (el.candleInstruction) el.candleInstruction.textContent = SURPRISE_CONFIG.cakeScene.instruction;

    // 4. Memories & Photos (with dummy fallback)
    const mem1 = SURPRISE_CONFIG.memories[0] || {};
    const mem2 = SURPRISE_CONFIG.memories[1] || {};

    setupMemoryImage(el.memoryImg1, mem1.src, mem1.fallbackText || "Memory 1");
    setupMemoryImage(el.memoryImg2, mem2.src, mem2.fallbackText || "Memory 2");

    if (el.memoryCaption1) el.memoryCaption1.textContent = mem1.caption || "";
    if (el.memoryCaption2) el.memoryCaption2.textContent = mem2.caption || "";

    // 5. Letter Content
    if (el.letterSalutation) el.letterSalutation.textContent = SURPRISE_CONFIG.missingLetter.salutation;
    if (el.letterRecipientName) el.letterRecipientName.textContent = SURPRISE_CONFIG.recipientName;

    if (el.letterParagraphsContainer && Array.isArray(SURPRISE_CONFIG.missingLetter.paragraphs)) {
      el.letterParagraphsContainer.innerHTML = '';
      SURPRISE_CONFIG.missingLetter.paragraphs.forEach((pText, i) => {
        const p = document.createElement('p');
        p.className = 'letter-p';
        if (i === 2) p.classList.add('letter-highlight'); // Highlight the missing you paragraph
        p.innerHTML = pText;
        el.letterParagraphsContainer.appendChild(p);
      });
    }

    if (el.letterSignoffText) el.letterSignoffText.textContent = SURPRISE_CONFIG.missingLetter.signoff;
    if (el.letterSignatureText) el.letterSignatureText.textContent = SURPRISE_CONFIG.missingLetter.signature;
  }

  // Fallback dummy image placeholder if image file is missing or still being uploaded
  function setupMemoryImage(imgElement, src, fallbackLabel) {
    if (!imgElement) return;
    imgElement.src = src;
    imgElement.onerror = () => {
      // Create high-res aesthetic SVG dummy placeholder
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <rect width="100%" height="100%" fill="#f1f2f6"/>
          <circle cx="200" cy="180" r="48" fill="#e4e7eb"/>
          <path d="M180 170 C180 160, 220 160, 220 170 L230 170 C235 170, 240 175, 240 180 L240 205 C240 210, 235 215, 230 215 L170 215 C165 215, 160 210, 160 205 L160 180 C160 175, 165 170, 170 170 Z" fill="#95a5a6"/>
          <circle cx="200" cy="192" r="14" fill="#ffffff"/>
          <text x="200" y="270" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#7f8c8d" text-anchor="middle">
            ${fallbackLabel}
          </text>
          <text x="200" y="292" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#bdc3c7" text-anchor="middle">
            (Replace in assets/)
          </text>
        </svg>
      `;
      imgElement.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };
  }

  // --- Ambient Background Stars ---
  function createAmbientStars() {
    el.ambientStars.innerHTML = '';
    const starCount = 36;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 3 + 1.2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = '#ffffff';
      star.style.opacity = Math.random() * 0.7 + 0.2;
      star.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.9)';
      star.style.animation = `pulseDot ${Math.random() * 3 + 2}s infinite alternate ease-in-out`;
      el.ambientStars.appendChild(star);
    }
  }

  // =========================================================
  // AUDIO & SOUND SYNTHESIS
  // =========================================================
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        state.audioCtx = new AudioCtxClass();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // 1. Balloon Pop Sound
  function playPopSound() {
    if (!state.soundFxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio not initialized', e);
    }
  }

  // 2. Candle Blow Sound
  function playBlowSound() {
    if (!state.soundFxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);
      filter.frequency.linearRampToValueAtTime(220, now + 0.45);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // 3. Victory Fanfare Chimes
  function playFanfareSound() {
    if (!state.soundFxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.01, startTime);
        gain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  // 4. Music Box Celesta Synthesizer (Happy Birthday to You)
  const HBD_NOTES = [
    { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1.00 }, { f: 392.00, d: 1.00 }, { f: 523.25, d: 1.00 }, { f: 493.88, d: 2.00 },
    { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 440.00, d: 1.00 }, { f: 392.00, d: 1.00 }, { f: 587.33, d: 1.00 }, { f: 523.25, d: 2.00 },
    { f: 392.00, d: 0.75 }, { f: 392.00, d: 0.25 }, { f: 783.99, d: 1.00 }, { f: 659.25, d: 1.00 }, { f: 523.25, d: 1.00 }, { f: 493.88, d: 1.00 }, { f: 440.00, d: 2.00 },
    { f: 698.46, d: 0.75 }, { f: 698.46, d: 0.25 }, { f: 659.25, d: 1.00 }, { f: 523.25, d: 1.00 }, { f: 587.33, d: 1.00 }, { f: 523.25, d: 2.50 }
  ];

  function playSynthNote(freq, startTime, durationSec) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const destination = getMusicGain() || ctx.destination;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, startTime); // Bell chime overtone

    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.25, startTime + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(destination); // → musicGainNode → ctx.destination

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + durationSec + 0.05);
    osc2.stop(startTime + durationSec + 0.05);
  }

  // Music master gain bus — all synth notes route through this
  // so we can mute/unmute without touching the shared AudioContext
  let musicGainNode = null;

  function getMusicGain() {
    const ctx = getAudioContext();
    if (!ctx) return null;
    if (!musicGainNode) {
      musicGainNode = ctx.createGain();
      musicGainNode.gain.setValueAtTime(0, ctx.currentTime);
      musicGainNode.connect(ctx.destination);
    }
    return musicGainNode;
  }

  function startBirthdayMusic() {
    if (state.musicPlaying) return; // already running, ignore double calls
    state.musicPlaying = true;
    updateMusicUI(true);

    // Ramp music gain up smoothly
    const ctx = getAudioContext();
    const mg = getMusicGain();
    if (ctx && mg) {
      mg.gain.cancelScheduledValues(ctx.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ctx.currentTime);
      mg.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.25);
    }

    // Try custom audio file first if configured
    if (SURPRISE_CONFIG.customAudioSrc && el.customAudio) {
      el.customAudio.src = SURPRISE_CONFIG.customAudioSrc;
      el.customAudio.play().then(() => {
        state.isUsingCustomAudio = true;
      }).catch(() => {
        // Custom audio missing or denied — fall back to synth
        playSynthesizerLoop();
      });
    } else {
      playSynthesizerLoop();
    }
  }

  function playSynthesizerLoop() {
    state.isUsingCustomAudio = false;
    const ctx = getAudioContext();
    if (!ctx || !state.musicPlaying) return;

    const tempoBpm = 94;
    const secPerBeat = 60 / tempoBpm;
    let curTime = ctx.currentTime + 0.1;

    for (let i = 0; i < HBD_NOTES.length; i++) {
      const item = HBD_NOTES[i];
      const noteDuration = item.d * secPerBeat;
      playSynthNote(item.f, curTime, noteDuration * 0.94);
      curTime += noteDuration;
    }

    const totalSongMs = (curTime - ctx.currentTime) * 1000;
    state.synthLoopTimer = setTimeout(() => {
      if (state.musicPlaying && !state.isUsingCustomAudio) {
        playSynthesizerLoop();
      }
    }, totalSongMs + 400);
  }

  function stopBirthdayMusic() {
    if (!state.musicPlaying) return; // already stopped, ignore double calls
    state.musicPlaying = false;

    // Ramp music gain down smoothly then clear the loop timer
    const ctx = state.audioCtx;
    const mg = musicGainNode;
    if (ctx && mg) {
      mg.gain.cancelScheduledValues(ctx.currentTime);
      mg.gain.setValueAtTime(mg.gain.value, ctx.currentTime);
      mg.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
    }

    // Stop custom audio element
    if (el.customAudio) {
      try { el.customAudio.pause(); el.customAudio.currentTime = 0; } catch(e) {}
    }

    // Cancel pending loop reschedule
    if (state.synthLoopTimer) {
      clearTimeout(state.synthLoopTimer);
      state.synthLoopTimer = null;
    }

    updateMusicUI(false);
  }

  function toggleMusic() {
    if (state.musicPlaying) {
      stopBirthdayMusic();
    } else {
      startBirthdayMusic();
    }
  }

  function updateMusicUI(isPlaying) {
    const iconEl = el.musicToggleBtn ? el.musicToggleBtn.querySelector('.music-icon') : null;
    if (iconEl) iconEl.textContent = isPlaying ? '🎵' : '⏸';
    if (el.musicStatusText) el.musicStatusText.textContent = isPlaying ? 'Music: On' : 'Music: Off';
    if (el.musicToggleBtn) {
      el.musicToggleBtn.style.background = isPlaying
        ? 'rgba(255, 94, 126, 0.45)'
        : 'rgba(255, 255, 255, 0.08)';
      el.musicToggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  }

  // =========================================================
  // RESPONSIVE CONFETTI CANVAS ENGINE
  // =========================================================
  let ctxCanvas = null;
  let particles = [];
  let isCanvasAnimating = false;

  function setupCanvas() {
    ctxCanvas = el.particleCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    el.particleCanvas.width = window.innerWidth;
    el.particleCanvas.height = window.innerHeight;
  }

  function spawnConfetti(x, y, count = 45, isFullShower = false) {
    const colors = ['#ff5e7e', '#ffbe3d', '#ff4757', '#2ed573', '#48cae4', '#ffffff', '#e056fd', '#f9ca24'];
    
    for (let i = 0; i < count; i++) {
      const angle = isFullShower ? (Math.PI / 2 + (Math.random() - 0.5) * 1.6) : (Math.random() * Math.PI * 2);
      const speed = isFullShower ? (Math.random() * 4 + 2.5) : (Math.random() * 9 + 3.5);
      
      particles.push({
        x: isFullShower ? Math.random() * window.innerWidth : x,
        y: isFullShower ? -20 : y,
        vx: Math.cos(angle) * speed,
        vy: isFullShower ? speed : Math.sin(angle) * speed,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        alpha: 1,
        decay: isFullShower ? (Math.random() * 0.006 + 0.003) : (Math.random() * 0.02 + 0.015),
        gravity: 0.18,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!isCanvasAnimating) {
      isCanvasAnimating = true;
      requestAnimationFrame(renderParticles);
    }
  }

  function renderParticles() {
    if (!ctxCanvas) return;
    ctxCanvas.clearRect(0, 0, el.particleCanvas.width, el.particleCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
        particles.splice(i, 1);
        continue;
      }

      ctxCanvas.save();
      ctxCanvas.globalAlpha = p.alpha;
      ctxCanvas.translate(p.x, p.y);
      ctxCanvas.rotate((p.rotation * Math.PI) / 180);
      ctxCanvas.fillStyle = p.color;

      if (p.shape === 'rect') {
        ctxCanvas.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      } else {
        ctxCanvas.beginPath();
        ctxCanvas.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctxCanvas.fill();
      }

      ctxCanvas.restore();
    }

    if (particles.length > 0) {
      requestAnimationFrame(renderParticles);
    } else {
      isCanvasAnimating = false;
      ctxCanvas.clearRect(0, 0, el.particleCanvas.width, el.particleCanvas.height);
    }
  }

  // =========================================================
  // SCENE NAVIGATION & BREADCRUMBS
  // =========================================================
  function switchScene(nextSceneId) {
    document.querySelectorAll('.scene').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(nextSceneId);
    if (target) {
      target.classList.add('active');
      state.currentScene = nextSceneId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update header progress dots
    el.journeySteps.forEach(step => {
      step.classList.remove('active');
      if (step.getAttribute('data-step') === nextSceneId) {
        step.classList.add('active');
      }
    });

    // Scene lifecycle hooks
    if (nextSceneId === 'sceneCake') {
      if (!state.musicPlaying) {
        startBirthdayMusic();
      }
      initMicBlowDetector();
    } else if (nextSceneId === 'sceneMemories') {
      stopMicDetector();
      setTimeout(() => spawnConfetti(window.innerWidth / 2, 0, 75, true), 350);
    }
  }

  // =========================================================
  // SCENE 2: BALLOONS LOGIC & COMBOS
  // =========================================================
  function renderBalloons() {
    el.balloonArena.innerHTML = '';
    state.poppedCount = 0;
    updateBalloonProgress();

    const isDesktop = window.innerWidth >= 640;
    // Organic grid layout positions
    const positions = isDesktop ? [
      { left: '10%', top: '12%' },
      { left: '38%', top: '8%' },
      { left: '72%', top: '14%' },
      { left: '14%', top: '54%' },
      { left: '42%', top: '50%' },
      { left: '76%', top: '52%' }
    ] : [
      // 2-column centered grid for mobile
      { left: '12%', top: '5%' },
      { left: '55%', top: '5%' },
      { left: '12%', top: '33%' },
      { left: '55%', top: '33%' },
      { left: '12%', top: '61%' },
      { left: '55%', top: '61%' }
    ];

    SURPRISE_CONFIG.balloons.forEach((bData, idx) => {
      const pos = positions[idx] || { left: '30%', top: '30%' };
      const balloon = document.createElement('div');
      balloon.className = 'balloon-item';
      balloon.setAttribute('role', 'button');
      balloon.setAttribute('tabindex', '0');
      balloon.setAttribute('aria-label', `Pop balloon: ${bData.title}`);
      balloon.style.left = pos.left;
      balloon.style.top = pos.top;
      balloon.style.background = `linear-gradient(135deg, ${bData.color1} 0%, ${bData.color2} 100%)`;
      balloon.style.animationDelay = `${(idx * 0.45) % 2}s`;

      balloon.innerHTML = `
        <span class="balloon-title-label">${bData.title}</span>
        <div class="balloon-item-knot"></div>
        <div class="balloon-item-string"></div>
      `;

      const onPop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (balloon.classList.contains('popping')) return;
        popBalloon(balloon, bData.subtitle, e);
      };

      balloon.addEventListener('click', onPop);
      balloon.addEventListener('touchstart', onPop, { passive: false });

      el.balloonArena.appendChild(balloon);
    });
  }

  function popBalloon(balloonEl, subtitleText, event) {
    balloonEl.classList.add('popping');
    playPopSound();

    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (e) {}
    }

    const rect = balloonEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    spawnConfetti(centerX, centerY, 35);
    showRevealedBadge(centerX, centerY, subtitleText);

    state.poppedCount++;
    updateBalloonProgress();

    setTimeout(() => balloonEl.remove(), 230);

    // All popped -> reveal message card
    if (state.poppedCount >= state.totalBalloons) {
      setTimeout(() => {
        playFanfareSound();
        spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 70);
        el.specialMessageModal.classList.remove('hidden');
      }, 550);
    }
  }

  function showRevealedBadge(x, y, text) {
    const badge = document.createElement('div');
    badge.className = 'revealed-badge-float';
    badge.textContent = text;
    badge.style.left = `${x}px`;
    badge.style.top = `${y}px`;
    badge.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(badge);

    setTimeout(() => badge.remove(), 1600);
  }

  function updateBalloonProgress() {
    const pct = (state.poppedCount / state.totalBalloons) * 100;
    el.balloonProgressFill.style.width = `${pct}%`;
    el.balloonStats.textContent = `${state.poppedCount} / ${state.totalBalloons} popped`;
  }

  // =========================================================
  // SCENE 3: CANDLE BLOW DETECTOR (MIC + TOUCH)
  // =========================================================
  async function initMicBlowDetector(fromUserGesture = false) {
    if (state.candleBlown) return;

    // Mobile browsers require a direct user gesture for getUserMedia.
    // Show the Allow Mic button and wait for a tap instead of auto-requesting.
    const isTouchDevice = navigator.maxTouchPoints > 0;
    if (isTouchDevice && !fromUserGesture) {
      if (el.enableMicBtn) el.enableMicBtn.style.display = '';
      updateMicStatus('📱 Tap "Allow Mic" to blow out the candle!', false);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      updateMicStatus('Microphone not supported. Tap the flickering flame! 👇', false);
      if (el.enableMicBtn) el.enableMicBtn.style.display = 'none';
      return;
    }

    try {
      // echoCancellation: false gives cleaner breath/blow signal
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      state.micStream = stream;
      const ctx = getAudioContext();
      if (!ctx) return;

      const source = ctx.createMediaStreamSource(stream);
      state.micAnalyser = ctx.createAnalyser();
      state.micAnalyser.fftSize = 256;
      source.connect(state.micAnalyser);

      state.micDataArray = new Uint8Array(state.micAnalyser.frequencyBinCount);
      updateMicStatus('🎙️ Listening: Blow gently into your microphone!', true);
      if (el.enableMicBtn) el.enableMicBtn.style.display = 'none';

      listenForBlow();
    } catch (err) {
      console.warn('Microphone permission not granted:', err);
      updateMicStatus(
        navigator.maxTouchPoints > 0
          ? '🔒 Mic blocked — check browser settings or tap the candle! 🕯️'
          : 'Mic permission off. Simply tap the candle to blow! 🕯️',
        false
      );
      if (el.enableMicBtn) el.enableMicBtn.style.display = '';
    }
  }

  function updateMicStatus(msg, isReady) {
    el.micStatusLabel.textContent = msg;
    if (isReady) el.micHalo.style.borderColor = 'var(--accent-gold)';
  }

  function listenForBlow() {
    if (state.candleBlown || !state.micAnalyser) return;

    state.micAnalyser.getByteFrequencyData(state.micDataArray);

    let lowEnergy = 0;
    const sampleBins = 18;
    for (let i = 2; i < 2 + sampleBins; i++) {
      lowEnergy += state.micDataArray[i];
    }
    const avgEnergy = lowEnergy / sampleBins;

    const meterPercent = Math.min(100, Math.round((avgEnergy / 135) * 100));
    el.micMeterFill.style.width = `${meterPercent}%`;

    if (meterPercent > 28) {
      el.micHalo.classList.add('active');
    } else {
      el.micHalo.classList.remove('active');
    }

    // Continuous breath burst trigger
    if (avgEnergy > 92) {
      state.blowThresholdCount++;
      if (state.blowThresholdCount >= 5) {
        extinguishCandle();
        return;
      }
    } else {
      state.blowThresholdCount = Math.max(0, state.blowThresholdCount - 1);
    }

    state.micAnimId = requestAnimationFrame(listenForBlow);
  }

  function stopMicDetector() {
    if (state.micAnimId) {
      cancelAnimationFrame(state.micAnimId);
      state.micAnimId = null;
    }
    if (state.micStream) {
      state.micStream.getTracks().forEach(t => t.stop());
      state.micStream = null;
    }
  }

  let countdownTimerId = null;
  let confettiShowerTimers = [];

  function clearCelebrationTimers() {
    if (countdownTimerId) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
    confettiShowerTimers.forEach(id => clearTimeout(id));
    confettiShowerTimers = [];
  }

  function extinguishCandle() {
    if (state.candleBlown) return;
    state.candleBlown = true;
    stopMicDetector();

    // 1. Wind puff waver on the flame
    el.candleTrigger.classList.add('blowing');

    if (navigator.vibrate) {
      try { navigator.vibrate([60, 40, 90]); } catch (e) {}
    }

    // 2. Extinguish flame after brief puff waver
    setTimeout(() => {
      playBlowSound();
      el.candleTrigger.classList.remove('blowing');
      el.candleTrigger.classList.add('blown');

      // Update in-scene text
      if (el.cakeTitle) el.cakeTitle.textContent = "✨ Wish Made! Happy Birthday! 🎉";
      if (el.candleInstruction) el.candleInstruction.textContent = "Watch your candle smoke drift to the stars... ✨";

      // Hide the mic action card and reveal the in-scene celebration card below the cake
      if (el.cakeActionCard) el.cakeActionCard.classList.add('hidden');
      if (el.cakeCelebrationCard) el.cakeCelebrationCard.classList.remove('hidden');

      // Celebration fanfare & initial burst
      playFanfareSound();
      spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 95, false);

      // Cascading celebratory confetti showers during viewing duration
      confettiShowerTimers.push(setTimeout(() => spawnConfetti(window.innerWidth * 0.35, 0, 45, true), 1400));
      confettiShowerTimers.push(setTimeout(() => spawnConfetti(window.innerWidth * 0.65, 0, 45, true), 3000));
      confettiShowerTimers.push(setTimeout(() => spawnConfetti(window.innerWidth * 0.50, 0, 40, true), 4800));

      // 7-second viewing countdown
      const totalDurationSec = 7;
      const startTime = Date.now();
      if (el.countdownNumber) el.countdownNumber.textContent = totalDurationSec;
      if (el.countdownBarFill) el.countdownBarFill.style.width = '0%';

      clearCelebrationTimers();

      countdownTimerId = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, Math.ceil(totalDurationSec - elapsed));
        const progress = Math.min(100, (elapsed / totalDurationSec) * 100);

        if (el.countdownNumber) el.countdownNumber.textContent = remaining;
        if (el.countdownBarFill) el.countdownBarFill.style.width = `${progress}%`;

        if (elapsed >= totalDurationSec) {
          clearCelebrationTimers();
          switchScene('sceneMemories');
        }
      }, 100);
    }, 280);
  }

  // =========================================================
  // LIGHTBOX & TOAST
  // =========================================================
  function openLightbox(src, caption) {
    el.modalImg.src = src;
    el.modalCaption.textContent = caption;
    el.imageModal.classList.remove('hidden');
  }

  function closeLightbox() {
    el.imageModal.classList.add('hidden');
  }

  function showToast(message) {
    el.toastNotification.textContent = message;
    el.toastNotification.classList.remove('hidden');
    setTimeout(() => el.toastNotification.classList.add('hidden'), 2500);
  }

  // =========================================================
  // EVENT WIRING
  // =========================================================
  function setupEventListeners() {
    // 1. Audio Header
    el.musicToggleBtn.addEventListener('click', () => {
      getAudioContext();
      toggleMusic();
    });

    // 2. Journey Navigation clicks
    el.journeySteps.forEach(step => {
      step.addEventListener('click', () => {
        const targetScene = step.getAttribute('data-step');
        if (targetScene) switchScene(targetScene);
      });
    });

    // 3. Scene 1: Gift Box 3D Open
    const openGift = () => {
      getAudioContext();
      el.giftBoxTrigger.classList.add('opened');
      playPopSound();
      spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.5, 60);

      // Smooth transition after lid flips open
      setTimeout(() => {
        switchScene('sceneBalloons');
      }, 550);
    };

    el.giftBoxTrigger.addEventListener('click', openGift);
    el.giftBoxTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGift();
      }
    });

    // 4. Scene 2: Next to Cake Room
    el.goToCakeBtn.addEventListener('click', () => {
      el.specialMessageModal.classList.add('hidden');
      switchScene('sceneCake');
    });

    // 5. Scene 3: Candle Blow
    const blowAction = () => {
      getAudioContext();
      extinguishCandle();
    };

    el.candleTrigger.addEventListener('click', blowAction);
    el.candleTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        blowAction();
      }
    });
    el.blowCandleManualBtn.addEventListener('click', blowAction);
    el.enableMicBtn.addEventListener('click', () => {
      getAudioContext();
      initMicBlowDetector(true); // fromUserGesture = true — required on mobile
    });

    // 6. Scene 3: Skip to memories early button
    if (el.skipToMemoriesBtn) {
      el.skipToMemoriesBtn.addEventListener('click', () => {
        clearCelebrationTimers();
        switchScene('sceneMemories');
      });
    }

    // 7. Scene 4: Memory Lightbox
    el.polaroid1.addEventListener('click', () => {
      const m = SURPRISE_CONFIG.memories[0] || {};
      openLightbox(el.memoryImg1.src, m.caption || "");
    });
    el.polaroid2.addEventListener('click', () => {
      const m = SURPRISE_CONFIG.memories[1] || {};
      openLightbox(el.memoryImg2.src, m.caption || "");
    });
    el.closeModalBtn.addEventListener('click', closeLightbox);
    el.imageModal.addEventListener('click', (e) => {
      if (e.target === el.imageModal) closeLightbox();
    });

    // 8. Scene 4: Replay Experience
    el.replaySurpriseBtn.addEventListener('click', () => {
      clearCelebrationTimers();
      state.candleBlown = false;
      el.giftBoxTrigger.classList.remove('opened');
      el.candleTrigger.classList.remove('blown', 'blowing');
      if (el.cakeActionCard) el.cakeActionCard.classList.remove('hidden');
      if (el.cakeCelebrationCard) el.cakeCelebrationCard.classList.add('hidden');
      if (el.cakeTitle) el.cakeTitle.textContent = SURPRISE_CONFIG.cakeScene.title;
      if (el.candleInstruction) el.candleInstruction.textContent = SURPRISE_CONFIG.cakeScene.instruction;
      if (el.countdownBarFill) el.countdownBarFill.style.width = '0%';
      el.specialMessageModal.classList.add('hidden');
      renderBalloons();
      switchScene('sceneLanding');
      showToast('Surprise reloaded! 🎁');
    });

    // Responsive arena resize
    window.addEventListener('resize', () => {
      resizeCanvas();
    });
  }

  // DOM ready kickoff
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
