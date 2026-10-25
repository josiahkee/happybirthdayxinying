/* =====================================================================
 *  CONTENT FILE
 *  All text, daily messages, photo captions, songs, and console replies!
 *
 *  TESTER PASSWORD (click the small key icon in the top-right corner):
 *    josiahjosiahjosiah123123123josiahjosiahjosiah!!
 * ===================================================================== */
window.BIRTHDAY_CONFIG = {
  name: "Xin Ying",
  age: 17,
  countdownTitle: "Days to xin ying's birthday",
  birthdayTitle: "Happy birthday xin ying!!",
  signoffLine: "from ur hb, josiah",
  testPassword: "josiahjosiahjosiah123123123josiahjosiahjosiah!!",
  compassImage: "photos/compass.jpg",
  timeZone: "Asia/Singapore",
  birthday: "2026-10-30T00:00:00+08:00",  // 30 October 00:00!
  candles: 7,
  autoplayMusic: true,

  /* ------------------------------------------------------------------
   *  DAILY CARDS (25/10 to 30/10)
   *  Every day has its own interactive mini-activity!
   *  Once 30/10 arrives, all 6 cards stay unlocked forever.
   * ------------------------------------------------------------------ */
  advent: [
    {
      day: 1,
      dateText: "25/10",
      unlock: "2026-10-25T00:00:00+08:00",
      type: "bout",
      iconKey: "foils",
      title: "Xin Ying vs Birthday Blues",
      subtitle: "tap strike to fence away the birthday blues!!",
      player: "Xin Ying",
      opponent: "Birthday Blues",
      compliments: [
        "jiayouu hg",
        "im alw here for uuu",
        "clean touch!! birthday blues stood zero chance",
        "1 more point!!",
        "touche!! xin ying wins 5 to 0 :)",
      ],
    },
    {
      day: 2,
      dateText: "26/10",
      unlock: "2026-10-26T00:00:00+08:00",
      type: "compassSpin",
      iconKey: "compass",
      title: "26/10",
      message:
        "Hi xinying!!! its 26/10!! (my mom's birthday)\n\n" +
        "How ru today? I hope ur better :(( can you believe its less than 5 days to your birthday\n\n" +
        "I cant wait to see ur bday outfit and all that happens at ur bday!! i promise youll get a great gift!!\n\n" +
        "see you tmr same place here :)",
      spinPrompt: "spin the stray kids compass to pick today's song!!",
    },
    {
      day: 3,
      dateText: "27/10",
      unlock: "2026-10-27T00:00:00+08:00",
      type: "bubbles",
      iconKey: "envelope",
      title: "27/10",
      message:
        "helloo! happy tuesday!!\n\n" +
        "don't be stressed okay! if anyt you can always text 80132351 yk\n\n" +
        "dw too much about everyt that happens\n\n" +
        "3 more days!!\n\n" +
        "see you tmr again!! and lmk if you see this so I know you actl saw this HAHA",
      bubblePrompt: "pop the bubble wrap below whenever u feel stressed!!",
      bubbleWords: [
        "jiayouu", "breathe", "u got this", "no stress",
        "here 4 u", "chill :)", "almost bday", "slay",
        "happy for u", "take a break", "smile!!", "yay!!",
      ],
    },
    {
      day: 4,
      dateText: "28/10",
      unlock: "2026-10-28T00:00:00+08:00",
      type: "scratch",
      iconKey: "envelope",
      title: "28/10",
      message:
        "hello again\n\n" +
        "ive been writing so much for everything HAHA im running out of stuff to say (but youll only see them once you get ur gift)\n\n" +
        "2 more days!!\n\n" +
        "hows the party planning going? I hope its okay\n\n" +
        "hopefully ill find a way to unlock everything after ur bday so you can always see this :))\n\n" +
        "jiayous!! see you tmr one last time!!",
      scratchPrompt: "rub / drag across the blue foil to scratch it off!!",
      scratchSecret: "see you sooonnnnn + hope ur ankle gets betterrr and send me pics from all the countries you go to!",
    },
    {
      day: 5,
      dateText: "29/10",
      unlock: "2026-10-29T00:00:00+08:00",
      type: "album",
      iconKey: "album",
      title: "29/10 · Photo Album",
      subtitle: "1 more sleep!! tap photos to zoom or switch to stickers to decorate :)",
      photos: [
        { photo: "image.png",       caption: "03.06.2026", strip: true },
        { photo: "photos/cut1.png", caption: "peaceee" },
        { photo: "photos/cut2.png", caption: "deeep thoughts" },
        { photo: "photos/cut3.png", caption: "moggg" },
        { photo: "photos/cut4.png", caption: "cutee" },
      ],
      note: "friends since 15!! def due for another photobooth run soon HAHA",
    },
    {
      day: 6,
      dateText: "30/10",
      unlock: "2026-10-30T00:00:00+08:00",
      type: "fireworks",
      iconKey: "heart",
      title: "30/10 · Happy Birthday!!",
      message: "THERES TOO MUCH I WANT TO SAYYYYY GO SEE WHATSAPP YAYAYAYAY",
      fireworkPrompt: "tap anywhere in the sky box to launch birthday fireworks!!",
    },
  ],

  /* ------------------------------------------------------------------
   *  DOUBLE-TAP CLOCK FENCING ENCOURAGEMENTS
   * ------------------------------------------------------------------ */
  fencingCheers: [
    "jiayouu hg",
    "im alw here for uuu",
    "touche!! +1 for xin ying",
  ],

  /* ------------------------------------------------------------------
   *  STRAY KIDS MUSIC PLAYER
   * ------------------------------------------------------------------ */
  playlist: [
    {
      title: "Social Path (feat. LiSA)",
      artist: "Stray Kids",
      src: "audio/social-path.mp3",
      url: "https://open.spotify.com/search/Stray%20Kids%20Social%20Path",
    },
    {
      title: "Respirator (산소호흡기)",
      artist: "HAN & Seungmin",
      src: "audio/respirator.mp3",
      url: "https://www.youtube.com/results?search_query=HAN+Seungmin+Respirator+SKZ-RECORD",
    },
    {
      title: "CINEMA",
      artist: "Lee Know & Seungmin",
      src: "audio/cinema.mp3",
      url: "https://open.spotify.com/search/Stray%20Kids%20CINEMA",
    },
    {
      title: "NIGHT (English ver.)",
      artist: "Stray Kids",
      src: "audio/night-english.mp3",
      url: "https://open.spotify.com/search/Stray%20Kids%20NIGHT%20English%20ver",
    },
  ],
  externalPlaylistUrl: "https://open.spotify.com/search/Stray%20Kids",

  /* ------------------------------------------------------------------
   *  BIRTHDAY DAY (30 Oct 00:00+)
   * ------------------------------------------------------------------ */
  cake: {
    hint: "make a wish for 17, then blow into your mic (or tap the candles)!",
    done: "yay!! scroll down to open your note and photo album :)",
  },

  letter: {
    greeting: "happy 17th birthday xin ying!!",
    body: "THERES TOO MUCH I WANT TO SAYYYYY GO SEE WHATSAPP YAYAYAYAY",
    signoff: "from ur hb, josiah",
  },

  scrapbook: [
    { photo: "image.png",       caption: "03.06.2026", strip: true },
    { photo: "photos/cut1.png", caption: "peaceee" },
    { photo: "photos/cut2.png", caption: "deeep thoughts" },
    { photo: "photos/cut3.png", caption: "moggg" },
    { photo: "photos/cut4.png", caption: "cutee" },
  ],

  /* ------------------------------------------------------------------
   *  SECRET CONSOLE (the [>_] button at the bottom, or press ` key)
   * ------------------------------------------------------------------ */
  terminal: {
    whoami: "xin ying · 17 · sg · fencer, engineer, stay, #54a6f7 enjoyer :)",
    skz:
      "fav stray kids rotation:\n" +
      "  1. Social Path (feat. LiSA)\n" +
      "  2. Respirator (산소호흡기)\n" +
      "  3. CINEMA\n" +
      "  4. NIGHT (English ver.)",
    yoyo: "   (o)\n    |\n    |\n   (@)  yoyo check passed!!",
    wish: "happy 17th birthday xin ying!! friends since 15 and still iconic. go check whatsapp too!! from ur hb, josiah",
    fencingFacts: [
      "jiayouu hg!! im alw here for uuu",
      "a fencing blade tip is the second fastest moving object in olympic sports",
      "xin ying vs birthday blues: 5 to 0 shutout every single time",
    ],
  },
};
