# Birthday Greeting Surprise 🎂✨

An interactive, mobile-first birthday surprise web app — shareable via a simple link.

## Features
- 🎁 Animated 3D gift box landing page
- 🎈 Interactive balloon popping with compliments
- 🎂 Birthday cake with mic-powered candle blowing + multi-wisp smoke animation
- 💌 Sweet memories polaroid gallery + handwritten "missing you" letter
- 🎵 Custom birthday music (MP3) with synthesizer fallback
- 📱 Fully responsive — mobile, tablet & desktop

## Customize
All content is configured in one place at the top of `script.js`:
```js
const SURPRISE_CONFIG = { ... }
```

Change the name, messages, balloons, letter, and audio path — no other edits needed!

## Add Your Photos & Music
Drop files into the `assets/` folder:
- `assets/memory1.jpg` — First sweet memory photo
- `assets/memory2.jpg` — Second sweet memory photo
- `assets/birthday.mp3` — Your custom birthday song

## Run Locally
```bash
node server.js
```
Open `http://localhost:3000` in your browser.

---
Made with love 💖 for **Lijo** from **Anisha** 🎂
