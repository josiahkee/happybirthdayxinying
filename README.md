# Xin Ying's Birthday Countdown (30 October)

A homemade birthday countdown website for Xin Ying's 17th birthday on **30 October**.

## How to Test Everything Early
1. Open `index.html`.
2. Click the **small key icon** in the top-right corner of the page (or open the **`>_` console** at the bottom and run `unlock josiahjosiahjosiah123123123josiahjosiahjosiah!!`).
3. Enter the password:
   `josiahjosiahjosiah123123123josiahjosiahjosiah!!`
4. Use the preview buttons at the top:
   - **Unlock all days**: opens all 6 cards (`25/10` to `30/10`) while keeping the real countdown running.
   - **30 Oct birthday**: previews her 30 Oct birthday cake, blow-out candles, envelope note, and photo album.
   - **5s midnight test**: counts down from 5 seconds to `00:00:00` so you can watch the live midnight transition.
   - **Lock & reset**: resets saved progress and returns to the real clock.

*(Note: Once `30/10` arrives, all 6 daily cards automatically remain unlocked forever so she can always revisit them!)*

## Daily Cards & Secret Console (`content.js`)
Everything editable lives inside `content.js`:
- **25/10**: `Xin Ying vs Birthday Blues` interactive fencing mini-game (with `"jiayouu hg"` and `"im alw here for uuu"`)
- **26/10**: Daily message + **Spin the Stray Kids Compass** song roulette
- **27/10**: Daily message + **Pop-the-Stress Bubble Wrap**
- **28/10**: Daily message + **Pixel Foil Scratch-Off Card**
- **29/10**: **Photo Album + Pixel Sticker Decorator** (`image.png` + `photos/cut1.png` to `cut4.png`: `"peaceee"`, `"deeep thoughts"`, `"moggg"`, `"cutee"`)
- **30/10**: Birthday message + **Interactive Night-Sky Firework Launcher**
- **Secret Console (`>_` button in footer or `` ` `` key)**: Fun commands (`help`, `whoami`, `countdown`, `skz`, `fencing`, `yoyo`, `photos`, `wish`, `cake`, `music`, `hbd`, `sudo`)
- **Music Player**: Plays `audio/social-path.mp3`, `audio/respirator.mp3`, `audio/cinema.mp3`, and `audio/night-english.mp3` with `photos/compass.jpg` spinning on the disc.

## Free Hosting Online
Drag the `xinying_birthday` folder onto **https://app.netlify.com/drop** (or host on Vercel / Cloudflare Pages / GitHub Pages) so live microphone candle-blowing works on her phone over `https`.
