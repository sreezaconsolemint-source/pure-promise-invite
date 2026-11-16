/* Pure Promise — scene list measured from the reference reel (times in s, boxes in px on the 1080x1920 stage). */
window.JFY_CFG = {
  id: 'purepromise', name: 'Pure Promise', dur: 73, brideFirst: true, musicLabel: '“Canon in D”, romantic',
  theme: { ink: '#4a2e1a', sink: '#5a3818', script: "'Great Vibes'", serif: "'Cormorant Garamond'" },
  cardStyle: 'plaque',
  opening: { kind: 'leaves', textAt: .45 },
  transition: { kind: 'leaves', d: .9, fill: '#0b3b24' },
  scenes: [
    { type: 'title', img: 'title', t0: 0, box: [130, 72, 820, 470], mv: [[1.0], [1.08, 540, 1350]], sz: { intro: 46, names: 104 }, fx: [{ k: 'petals', n: 14 }] },
    { type: 'names', img: 'names', t0: 7.7, box: [70, 20, 940, 720], sz: { inv: 38, name: 104, par: 47, weds: 72 }, style: 'none', mv: [[1.0], [1.06, 540, 1500]], fx: [{ k: 'fireworks', y0: 80, y1: 760, every: .75 }] },
    { type: 'event', ev: 0, label: 'Mehendi', icon: '🌿', img: 'mehndi', t0: 16.0, box: [125, 290, 830, 385], mv: [[1.06, 540, 1300], [1.0, 540, 1300]], fx: [{ k: 'fireworks', y0: 40, y1: 260, size: 220, every: .9 }] },
    { type: 'event', ev: 1, label: 'Engagement', icon: '💍', img: 'engage', t0: 24.4, box: [125, 118, 830, 385], mv: [[1.0], [1.07, 540, 1200]], fx: [{ k: 'sparkle', n: 60, y0: 0, y1: 1100 }] },
    { type: 'event', ev: 2, label: 'Haldi', icon: '💛', img: 'haldi', t0: 32.85, box: [125, 170, 830, 390], mv: [[1.07, 540, 1100], [1.0, 540, 1100]], fx: [{ k: 'petals', n: 18, cols: ['#ffc928', '#ff9f1a', '#ffe066', '#f77f00'] }] },
    { type: 'event', ev: 3, label: 'Sangeet', icon: '🎶', img: 'sangeet', t0: 41.2, box: [125, 160, 830, 385], mv: [[1.0], [1.07, 540, 1300]], fx: [{ k: 'fireworks', y0: 60, y1: 640, every: .6 }] },
    { type: 'event', ev: 4, label: 'Wedding', icon: '🔥', img: 'wedding', t0: 49.55, box: [125, 405, 830, 390], mv: [[1.08, 540, 1500], [1.0, 540, 1500]], fx: [{ k: 'bokeh', n: 22 }] },
    { type: 'event', ev: 5, label: 'Reception', icon: '🥂', img: 'reception', t0: 57.9, box: [262, 404, 564, 386], style: 'none', pad: [20, 26], sz: { title: 72, line: 36 }, mv: [[1.0], [1.05, 540, 960]], fx: [{ k: 'fireworks', y0: 40, y1: 300, size: 200, every: .8 }] },
    { type: 'rsvp', img: 'names', t0: 66.0, box: [70, 90, 940, 680], sz: { kindly: 50, word: 106, by: 48, comp: 48, fam: 96, contact: 46 }, style: 'none', mv: [[1.16, 540, 1600], [1.1, 540, 1600]], fx: [{ k: 'fireworks', y0: 60, y1: 640, every: .7 }] }
  ]
};
