/* Just For You — Artrovers-style video invitation kit. One deterministic timeline drives every scene,
   text card, particle effect and transition, so playback mirrors the reference reel and the editor can seek. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFG = window.JFY_CFG, TH = CFG.theme || {}, DUR = CFG.dur;
  var Q = new URLSearchParams(location.search), PV = Q.get('preview') === '1';
  var MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAY = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pdate(v) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v || ''); return m ? { y: +m[1], m: +m[2], d: +m[3], w: new Date(+m[1], +m[2] - 1, +m[3]).getDay() } : null; }
  function loadData() {
    var m = /[#&]data=([^&]+)/.exec(location.hash), base = JSON.parse(JSON.stringify(window.JFY_DATA || {}));
    if (!m || !window.JFYCodec) return Promise.resolve(base);
    return JFYCodec.decode(m[1]).then(function (d) {
      d = d || {}; if (!d.music_url) d.music_url = base.music_url; if (!d.music_credit && d.music_url === base.music_url) d.music_credit = base.music_credit; return d;
    }).catch(function (e) { console.warn('Invitation data could not be read, showing the demo.', e); return base; });
  }

  /* ---------- ornate card (vector, razor sharp) ---------- */
  function plaque(x, y, w, h, r, t) {
    return 'M' + (x + r) + ' ' + (y + t) + 'C' + (x + w * .33) + ' ' + (y + t) + ' ' + (x + w * .4) + ' ' + y + ' ' + (x + w / 2) + ' ' + y +
      'C' + (x + w * .6) + ' ' + y + ' ' + (x + w * .67) + ' ' + (y + t) + ' ' + (x + w - r) + ' ' + (y + t) +
      'A' + r + ' ' + r + ' 0 0 0 ' + (x + w) + ' ' + (y + t + r) + 'Q' + (x + w * .975) + ' ' + (y + h / 2) + ' ' + (x + w) + ' ' + (y + h - t - r) +
      'A' + r + ' ' + r + ' 0 0 0 ' + (x + w - r) + ' ' + (y + h - t) + 'C' + (x + w * .67) + ' ' + (y + h - t) + ' ' + (x + w * .6) + ' ' + (y + h) + ' ' + (x + w / 2) + ' ' + (y + h) +
      'C' + (x + w * .4) + ' ' + (y + h) + ' ' + (x + w * .33) + ' ' + (y + h - t) + ' ' + (x + r) + ' ' + (y + h - t) +
      'A' + r + ' ' + r + ' 0 0 0 ' + x + ' ' + (y + h - t - r) + 'Q' + (x + w * .025) + ' ' + (y + h / 2) + ' ' + x + ' ' + (y + t + r) +
      'A' + r + ' ' + r + ' 0 0 0 ' + (x + r) + ' ' + (y + t) + 'Z';
  }
  function arch(x, y, w, h) { var r = w / 2; return 'M' + x + ' ' + (y + h) + 'V' + (y + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + w) + ' ' + (y + r) + 'V' + (y + h) + 'Z'; }
  function rrect(x, y, w, h, r) { return 'M' + (x + r) + ' ' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + r) + 'V' + (y + h - r) + 'Q' + (x + w) + ' ' + (y + h) + ' ' + (x + w - r) + ' ' + (y + h) + 'H' + (x + r) + 'Q' + x + ' ' + (y + h) + ' ' + x + ' ' + (y + h - r) + 'V' + (y + r) + 'Q' + x + ' ' + y + ' ' + (x + r) + ' ' + y + 'Z'; }
  var gid = 0;
  function cardSVG(style, w, h, c) {
    c = c || {}; var id = 'g' + (++gid), gold = c.gold || ['#f7e3a1', '#c99a3e', '#fbeab0', '#a8782a', '#e8c873'], fill = c.fill || '#fbf3df', fill2 = c.fill2 || '#f6e8c8';
    var defs = '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' + gold.map(function (g, i) { return '<stop offset="' + (i / (gold.length - 1)) + '" stop-color="' + g + '"/>'; }).join('') + '</linearGradient>' +
      '<radialGradient id="' + id + 'f" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="' + fill + '"/><stop offset="1" stop-color="' + fill2 + '"/></radialGradient></defs>';
    var p = function (d) { return style === 'arch' ? arch(d, d, w - 2 * d, h - 2 * d) : style === 'rect' ? rrect(d, d, w - 2 * d, h - 2 * d, c.radius || 18) : plaque(d, d, w - 2 * d, h - 2 * d, w * .085 + d * .6, h * .07); };
    var op = c.opacity == null ? 1 : c.opacity;
    return '<svg class="card" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' + defs +
      (style === 'plain' ? '<path d="' + rrect(0, 0, w, h, c.radius || 6) + '" fill="url(#' + id + 'f)" opacity="' + op + '"/>' :
      '<path d="' + p(0) + '" fill="url(#' + id + ')"/><path d="' + p(11) + '" fill="url(#' + id + 'f)" opacity="' + op + '"/><path d="' + p(21) + '" fill="none" stroke="url(#' + id + ')" stroke-width="3"/>') + '</svg>';
  }
  function divider() { return '<svg class="div" viewBox="0 0 320 20" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2" opacity=".75"><path d="M0 10H136M184 10H320"/><path d="M160 10c-8-9-20-9-20 0s12 9 20 0c8-9 20-9 20 0s-12 9-20 0Z"/></g></svg>'; }

  /* ---------- scene text blocks ---------- */
  var SZ = {
    title: { intro: 46, names: 100 },
    names: { inv: 33, name: 84, par: 40, weds: 64 },
    event: { title: 88, line: 44 },
    rsvp: { kindly: 44, word: 88, by: 42, comp: 42, fam: 80, contact: 40 }
  };
  function px(sc, k) { var z = (sc.sz && sc.sz[k]) || SZ[sc.type][k]; return 'font-size:' + z + 'em'; }
  function blockHTML(sc) {
    var o = '';
    if (sc.type === 'title') o = '<p class="r" data-k="intro_line" style="' + px(sc, 'intro') + '"></p>' + divider() + '<p class="s" data-k="couple" style="' + px(sc, 'names') + '"></p>';
    else if (sc.type === 'names') o = '<div class="r ml" data-k="invite_text" style="' + px(sc, 'inv') + '"></div>' + divider() +
      '<p class="s" data-k="first_name" style="' + px(sc, 'name') + '"></p><p class="r" data-k="first_parents" style="' + px(sc, 'par') + '"></p>' +
      '<p class="s" data-k="weds_word" style="' + px(sc, 'weds') + ';margin:.1em 0"></p>' +
      '<p class="s" data-k="second_name" style="' + px(sc, 'name') + '"></p><p class="r" data-k="second_parents" style="' + px(sc, 'par') + '"></p>';
    else if (sc.type === 'event') o = '<p class="s" data-e="title" style="' + px(sc, 'title') + '"></p>' + divider() + '<p class="r" data-e="when" style="' + px(sc, 'line') + '"></p><p class="r" data-e="venue" style="' + px(sc, 'line') + '"></p>';
    else if (sc.type === 'rsvp') o = '<p class="r" data-k="rsvp_kindly" style="' + px(sc, 'kindly') + '"></p><p class="s" data-k="rsvp_word" style="' + px(sc, 'word') + '"></p><p class="r" data-k="rsvp_by_txt" style="' + px(sc, 'by') + '"></p>' + divider() +
      '<p class="r" data-k="compliments" style="' + px(sc, 'comp') + ';margin-top:.4em"></p><p class="s" data-k="family_name" style="' + px(sc, 'fam') + '"></p><p class="r" data-k="contact" style="' + px(sc, 'contact') + '"></p>';
    return o;
  }
  var root = $('#scenes'), boxes = document.createElement('div'); boxes.id = 'boxes'; $('#stage').insertBefore(boxes, $('#trans'));
  CFG.scenes.forEach(function (sc, i) {
    var s = document.createElement('section'); s.className = 'sc'; s.id = 'sc' + i;
    s.innerHTML = '<img class="bg" src="assets/img/' + sc.img + '.webp" alt="">'; root.appendChild(s);
    if (!sc.box) return;
    var b = sc.box, st = sc.style || CFG.cardStyle || 'plaque', bl = document.createElement('section'); bl.className = 'sc'; bl.id = 'bl' + i;
    var v = '--ink:' + (sc.ink || TH.ink || '#4a2e1a') + ';--sink:' + (sc.sink || TH.sink || TH.ink || '#5b3a1c') + ';--script:' + (sc.script || TH.script || "'Great Vibes'") + ',cursive;--serif:' + (TH.serif || "'Cormorant Garamond'") + ',serif;' + (sc.shadow ? '--shadow:' + sc.shadow + ';' : '') + (TH.rw ? '--rw:' + TH.rw + ';' : '');
    var pad = sc.pad || (st === 'plaque' ? [56, 70] : st === 'none' ? [0, 0] : [40, 40]);
    bl.innerHTML = '<div class="box ' + st + ' t-' + sc.type + '" data-ev="' + (sc.ev == null ? '' : sc.ev) + '" style="left:' + b[0] + 'px;top:' + b[1] + 'px;width:' + b[2] + 'px;height:' + b[3] + 'px;' + v + '">' +
      (st === 'none' ? '' : cardSVG(st, b[2], b[3], sc.card || CFG.card)) + '<div class="in" style="padding:' + pad[0] + 'px ' + pad[1] + 'px">' + blockHTML(sc) + '</div></div>';
    boxes.appendChild(bl);
  });

  function set(el, v) { if (!el) return; el.textContent = v || ''; el.classList.toggle('hide', !v); }
  function render(D) {
    var bf = CFG.brideFirst !== false;
    var first = bf ? D.bride_name : D.groom_name, second = bf ? D.groom_name : D.bride_name;
    var calc = {
      couple: [first, second].filter(Boolean).join(' & '),
      first_name: first, second_name: second,
      first_parents: bf ? D.bride_parents : D.groom_parents, second_parents: bf ? D.groom_parents : D.bride_parents,
      rsvp_by_txt: (function () { var p = pdate(D.rsvp_by); return p ? 'By ' + p.d + ' ' + MON[p.m - 1] + ' ' + p.y : ''; })()
    };
    $$('[data-k]').forEach(function (el) {
      var k = el.dataset.k, v = k in calc ? calc[k] : D[k];
      if (el.classList.contains('ml')) {
        el.innerHTML = ''; var any = false;
        String(v || '').split(/\r?\n/).forEach(function (l) { l = l.trim(); if (!l) return; var n = document.createElement('div'); n.textContent = l; el.appendChild(n); any = true; });
        el.classList.toggle('hide', !any);
      } else set(el, (v || '').trim());
    });
    $$('.box[data-ev]').forEach(function (bx) {
      if (bx.dataset.ev === '') return;
      var e = (D.events || [])[+bx.dataset.ev] || {}, p = pdate(e.date), when = [];
      if (p) when.push(DAY[p.w].slice(0, 3) + ', ' + p.d + ' ' + MON[p.m - 1].slice(0, 3) + ' ' + p.y);
      if (e.time) when.push(e.time);
      set($('[data-e=title]', bx), e.title); set($('[data-e=when]', bx), when.join(' | '));
      set($('[data-e=venue]', bx), e.venue ? (CFG.venuePrefix == null ? 'Venue - ' : CFG.venuePrefix) + e.venue : '');
    });
    // a divider only shows when there is text on both sides of it
    $$('.box .div').forEach(function (d) {
      var prev = d.previousElementSibling, next = d.nextElementSibling, a = false, b = false;
      for (var n = prev; n; n = n.previousElementSibling) if (!n.classList.contains('hide') && !n.classList.contains('div')) a = true;
      for (n = next; n; n = n.nextElementSibling) if (!n.classList.contains('hide') && !n.classList.contains('div')) b = true;
      d.classList.toggle('hide', !(a && b));
    });
    var wa = (D.rsvp_whatsapp || '').replace(/\D/g, ''), rs = $('#rsvp'); rs.classList.toggle('hide', !wa);
    if (wa) rs.href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Hi! Thank you for the invitation to ' + calc.couple + "'s wedding. I'd love to attend 💐");
    var venue = ''; (D.events || []).forEach(function (e) { if (!venue && e && e.venue) venue = e.venue; });
    var mapUrl = D.venue_map_url || (venue ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue) : '');
    var mp = $('#map'); mp.classList.toggle('hide', !mapUrl); if (mapUrl) mp.href = mapUrl;
    $('#credit').textContent = D.music_url && D.music_enabled !== false && D.music_credit ? 'Music: ' + D.music_credit : '';
    if (calc.couple) document.title = calc.couple + ' — Wedding Invitation';
  }
  /* shrink text inside a box until it fits */
  function fitBoxes() {
    $$('.box .in').forEach(function (inn) {
      var sec = inn.closest('.sc'), vis = sec.style.visibility; sec.style.visibility = 'visible';
      var k = 1; inn.style.setProperty('--k', k);
      var H = inn.clientHeight, W = inn.clientWidth;
      var over = function () { var hh = 0; Array.prototype.forEach.call(inn.children, function (c) { if (!c.classList.contains('hide')) hh += c.offsetHeight + parseFloat(getComputedStyle(c).marginTop || 0) + parseFloat(getComputedStyle(c).marginBottom || 0); }); var cs = getComputedStyle(inn); return hh > H - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) || inn.scrollWidth > W + 1; };
      while (over() && k > .55) { k -= .03; inn.style.setProperty('--k', k.toFixed(3)); }
      sec.style.visibility = vis;
    });
  }

  /* ---------- keyframe engine ---------- */
  var E = { io: function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }, out: function (p) { return 1 - Math.pow(1 - p, 3); }, in: function (p) { return p * p * p; }, lin: function (p) { return p; } };
  var tracks = [], DEF = { o: 1, x: 0, y: 0, s: 1, r: 0, ry: 0, b: 0 };
  function K(el, k) { if (typeof el === 'string') el = $(el); if (el) tracks.push({ el: el, k: k }); }
  function val(k, t) {
    if (t <= k[0][0]) return k[0][1];
    for (var i = 1; i < k.length; i++) if (t <= k[i][0]) {
      var a = k[i - 1], b = k[i], p = (t - a[0]) / (b[0] - a[0] || 1), e = (E[b[2] || 'io'])(p), r = {};
      for (var key in DEF) { var va = key in a[1] ? a[1][key] : DEF[key], vb = key in b[1] ? b[1][key] : va; r[key] = va + (vb - va) * e; }
      return r;
    }
    return k[k.length - 1][1];
  }
  function apply(tr, t) {
    var v = val(tr.k, t), o = 'o' in v ? v.o : 1, st = tr.el.style;
    st.opacity = o.toFixed(3); st.visibility = o <= .001 ? 'hidden' : 'visible';
    st.transform = 'translate3d(' + (v.x || 0).toFixed(2) + 'px,' + (v.y || 0).toFixed(2) + 'px,0)' + (v.r ? ' rotate(' + v.r.toFixed(2) + 'deg)' : '') + ' scale(' + (v.s == null ? 1 : v.s).toFixed(4) + ')';
    st.filter = v.b > .05 ? 'blur(' + v.b.toFixed(2) + 'px)' : '';
  }
  function C(s, cx, cy) { cx = cx == null ? 540 : cx; cy = cy == null ? 960 : cy; return { s: s, x: cx - cx * s, y: cy - cy * s }; }

  /* ---------- transitions ---------- */
  var trans = $('#trans'); trans.className = 'trans';
  var TR = CFG.transition || { kind: 'fade', d: .5 };
  var LEAVES = [[160, 260, 20], [880, 420, -30], [420, 900, 60], [980, 1250, 10], [200, 1500, -50], [700, 1780, 35], [540, 640, 100]];
  function leafSet(img, tint) {
    var els = LEAVES.map(function (L, i) { var im = document.createElement('img'); im.className = 'leaf'; im.src = 'assets/img/' + img + '.webp'; im.alt = ''; if (tint) im.style.filter = tint; trans.appendChild(im); return im; });
    return els;
  }
  function build() {
    tracks = [];
    var S = CFG.scenes, open = CFG.opening || { kind: 'none' };
    S.forEach(function (sc, i) {
      var t0 = sc.t0, t1 = i < S.length - 1 ? S[i + 1].t0 : DUR + 1, f = sc.fadeIn || (TR.kind === 'fade' && i > 0 ? TR.d : 0);
      var vis = f ? [[t0 - f, { o: 0 }], [t0, { o: 1 }, 'lin']] : [[t0 - .001, { o: 0 }], [t0, { o: 1 }, 'lin']];
      var end = [[t1 + (S[i + 1] && (S[i + 1].fadeIn || (TR.kind === 'fade' ? TR.d : 0)) ? 0 : 0), { o: 1 }], [t1 + .001, { o: 0 }, 'lin']];
      if (i === 0) vis = [[0, { o: 1 }]];
      K('#sc' + i, vis.concat(end));
      var mv = sc.mv || [[1.04], [1.0]], a = mv[0], b = mv[1];
      K('#sc' + i + ' .bg', [[t0 - (f || 0), C(a[0], a[1], a[2])], [t1, C(b[0], b[1], b[2]), 'lin']]);
      if ($('#bl' + i)) {
        var ti = t0 + (i === 0 ? (open.textAt || .5) : (sc.textIn || .25));
        K('#bl' + i, [[ti, { o: 0 }], [ti + .5, { o: 1 }, 'out'], [t1, { o: 1 }], [t1 + .001, { o: 0 }]]);
        K('#bl' + i + ' .box', [[ti, { s: .94, y: 18 }], [ti + .7, { s: 1, y: 0 }, 'out']]);
      }
    });
    trans.innerHTML = '';
    if (TR.kind === 'leaves' || open.kind === 'leaves') {
      var leaves = leafSet(TR.img || 'leaf', TR.tint), fill = document.createElement('div'); fill.className = 'fill'; fill.style.background = TR.fill || '#0b3b24'; trans.insertBefore(fill, trans.firstChild);
      var keys = leaves.map(function () { return []; }), fk = [[0, { o: 0 }]];
      if (open.kind === 'leaves') {
        fk = [[0, { o: 1 }], [.1, { o: 1 }], [.3, { o: 0 }, 'lin']];
        leaves.forEach(function (lf, j) { var L = LEAVES[j]; keys[j].push([0, { o: 1, x: L[0], y: L[1], r: L[2], s: 1.15 }], [.06, { o: 1, x: L[0], y: L[1], r: L[2], s: 1.15 }], [.5, { o: 1, x: L[0] + (L[0] < 540 ? -1300 : 1300), y: L[1] - 900, r: L[2] + 70, s: 1.3 }, 'in'], [.51, { o: 0 }]); });
      }
      if (TR.kind === 'leaves') S.forEach(function (sc, i) {
        if (!i) return; var T = sc.t0, d = TR.d || .9;
        leaves.forEach(function (lf, j) {
          var L = LEAVES[j], dx = L[0] < 540 ? -1 : 1;
          keys[j].push([T - d * .55, { o: 0, x: L[0] - 1300, y: L[1] + 1300, r: L[2] - 80, s: 1.1 }], [T - d * .55 + .01, { o: 1, x: L[0] - 1300, y: L[1] + 1300, r: L[2] - 80, s: 1.1 }],
            [T, { o: 1, x: L[0], y: L[1], r: L[2], s: 1.15 }, 'out'], [T + d * .5, { o: 1, x: L[0] + 1300 * dx, y: L[1] - 1200, r: L[2] + 70, s: 1.25 }, 'in'], [T + d * .5 + .01, { o: 0 }]);
        });
      });
      leaves.forEach(function (lf, j) { if (keys[j].length) K(lf, keys[j]); else lf.remove(); });
      K(fill, fk);
    }
    if (TR.kind === 'flash') {
      var fl = document.createElement('div'); fl.className = 'fill'; fl.style.background = TR.fill || '#fff'; trans.appendChild(fl);
      var k = [[0, { o: 0 }]]; S.forEach(function (sc, i) { if (i) k.push([sc.t0 - .2, { o: 0 }], [sc.t0, { o: 1 }, 'lin'], [sc.t0 + .35, { o: 0 }, 'lin']); }); K(fl, k);
    }
    if (open.kind === 'fade') { var of = document.createElement('div'); of.className = 'fill'; of.style.background = open.fill || '#000'; trans.appendChild(of); K(of, [[0, { o: 1 }], [open.d || .8, { o: 0 }, 'lin']]); }
  }

  /* ---------- deterministic particle effects ---------- */
  var cv = $('#fx'), cx = cv.getContext('2d');
  function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  var PAL = { fire: ['#ffd27a', '#ff8fb1', '#b6e3ff', '#fff3c4', '#ffb36b', '#e7b8ff'], gold: ['#ffe9a8', '#ffd36b', '#fff6d6'] };
  function fireworks(t, t0, o) {
    var y0 = o.y0 || 80, y1 = o.y1 || 640, every = o.every || .7;
    cx.globalCompositeOperation = 'lighter';
    var n = Math.floor((t - t0) / every);
    for (var b = Math.max(0, n - 3); b <= n; b++) {
      var tb = t0 + b * every + rnd(b * 7.3 + t0) * .25, age = t - tb; if (age < 0 || age > 2.2) continue;
      var bx = 120 + rnd(b * 3.1 + t0) * 840, by = y0 + rnd(b * 5.7 + t0) * (y1 - y0), col = (o.pal || PAL.fire)[Math.floor(rnd(b * 9.9) * 6) % (o.pal || PAL.fire).length];
      var R = (o.size || 300) * (.75 + rnd(b * 2.2) * .5), np = 64, al = Math.max(0, 1 - age / 2.2);
      if (age < .35) { cx.fillStyle = 'rgba(255,240,200,' + (.9 * (1 - age / .35)) + ')'; cx.beginPath(); cx.arc(bx, by, 18 + age * 60, 0, 7); cx.fill(); }
      cx.fillStyle = col;
      for (var j = 0; j < np; j++) {
        var ang = j / np * Math.PI * 2 + rnd(b) * .3, sp = R * (.85 + rnd(j * 1.7 + b) * .3), d = sp * (1 - Math.exp(-age * 2.6));
        for (var tr = 0; tr < 4; tr++) {
          var dd = d * (1 - tr * .06), px = bx + Math.cos(ang) * dd, py = by + Math.sin(ang) * dd + 60 * age * age;
          cx.globalAlpha = al * (1 - tr * .24) * (.6 + .4 * Math.sin(age * 20 + j)); cx.beginPath(); cx.arc(px, py, 3.4 - tr * .6, 0, 7); cx.fill();
        }
      }
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  }
  function petals(t, t0, o) {
    var n = o.n || 34, cols = o.cols || ['#f7a1b8', '#f48fb1', '#ffc1d3', '#e86a8f'];
    for (var i = 0; i < n; i++) {
      var sp = 110 + rnd(i * 3.3) * 120, x = rnd(i * 1.1) * 1080 + Math.sin(t * (.8 + rnd(i) * .6) + i) * 60, y = (rnd(i * 2.7) * 2100 + sp * (t - t0)) % 2100 - 90, rot = t * (1 + rnd(i * 4.4) * 2) + i;
      cx.save(); cx.translate(x, y); cx.rotate(rot); cx.scale(1, .55 + .45 * Math.sin(t * 2 + i)); cx.fillStyle = cols[i % cols.length]; cx.globalAlpha = .9;
      cx.beginPath(); cx.ellipse(0, 0, 16 + rnd(i * 5) * 8, 10, 0, 0, 7); cx.fill(); cx.restore();
    }
    cx.globalAlpha = 1;
  }
  function sparkle(t, t0, o) {
    var n = o.n || 70, y0 = o.y0 || 0, y1 = o.y1 || 1920;
    cx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) {
      var x = rnd(i * 1.3) * 1080, y = y0 + rnd(i * 2.9) * (y1 - y0), a = Math.max(0, Math.sin(t * (1.5 + rnd(i) * 2) + i * 2.1)), s = (4 + rnd(i * 7) * 9) * a;
      if (a < .05) continue;
      cx.fillStyle = o.col || '#fff6d8'; cx.globalAlpha = a;
      cx.beginPath(); cx.moveTo(x, y - s * 2.2); cx.quadraticCurveTo(x, y, x + s * 2.2, y); cx.quadraticCurveTo(x, y, x, y + s * 2.2); cx.quadraticCurveTo(x, y, x - s * 2.2, y); cx.quadraticCurveTo(x, y, x, y - s * 2.2); cx.fill();
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  }
  function bokeh(t, t0, o) {
    var n = o.n || 26;
    cx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) {
      var x = (rnd(i * 1.9) * 1180 + Math.sin(t * .3 + i) * 50) - 50, y = (rnd(i * 3.7) * 2000 - (t - t0) * (20 + rnd(i) * 30)) % 2000; if (y < -60) y += 2000;
      var r = 10 + rnd(i * 6.1) * 26, g = cx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, o.col || 'rgba(255,214,130,.55)'); g.addColorStop(1, 'rgba(255,214,130,0)'); cx.fillStyle = g; cx.globalAlpha = .5 + .5 * Math.sin(t * 1.3 + i);
      cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
    }
    cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
  }
  var FX = { fireworks: fireworks, petals: petals, sparkle: sparkle, bokeh: bokeh };
  function drawFx(t) {
    cx.clearRect(0, 0, 1080, 1920);
    var S = CFG.scenes;
    for (var i = 0; i < S.length; i++) {
      var t0 = S[i].t0, t1 = i < S.length - 1 ? S[i + 1].t0 : DUR + 1; if (t < t0 || t >= t1) continue;
      (S[i].fx || []).forEach(function (f) { if (FX[f.k]) FX[f.k](t, t0, f); });
    }
  }

  /* ---------- player ---------- */
  var stage = $('#stage'), audio = $('#music'), D = {}, t = 0, playing = false, last = 0, raf = 0, curBg = '';
  function fit() { stage.style.transform = 'translate(-50%,-50%) scale(' + Math.min(innerWidth / 1080, innerHeight / 1920) + ')'; }
  function draw() {
    for (var i = 0; i < tracks.length; i++) apply(tracks[i], t);
    drawFx(t);
    var b = CFG.scenes[0].img; CFG.scenes.forEach(function (s) { if (t >= s.t0) b = s.img; });
    if (b !== curBg) { curBg = b; $('#backdrop').style.backgroundImage = 'url(assets/img/' + b + '.webp)'; }
  }
  function frame(now) {
    if (!playing) return;
    var dt = Math.min(.1, (now - last) / 1000); last = now; t += dt;
    if (!audio.paused && audio.readyState >= 3 && !audio.seeking && Math.abs(audio.currentTime - t) > .3) { try { audio.currentTime = t; } catch (e) {} }
    if (t >= DUR) { t = DUR; playing = false; draw(); finish(); return; }
    draw(); raf = requestAnimationFrame(frame);
  }
  function play(from) {
    cancelAnimationFrame(raf); t = from || 0; $('#end').hidden = true; playing = true; last = performance.now(); draw();
    if (audio.src && D.music_enabled !== false && !PV) { try { audio.currentTime = t; } catch (e) {} audio.volume = 1; audio.play().catch(function () {}); $('#mute').hidden = false; }
    raf = requestAnimationFrame(frame);
  }
  function finish() { $('#end').hidden = false; var v = 1, f = setInterval(function () { v -= .08; audio.volume = Math.max(0, Math.min(1, v)); if (v <= 0) { clearInterval(f); audio.pause(); audio.volume = 1; } }, 120); }
  window.JFYPlayer = { seek: function (s, run) { cancelAnimationFrame(raf); t = Math.max(0, Math.min(DUR, s)); playing = false; draw(); if (run) play(t); }, get t() { return t; } };
  addEventListener('resize', fit); fit();
  addEventListener('message', function (e) { var m = e.data || {}; if (m.type === 'jfy:seek') JFYPlayer.seek(+m.t || 0, m.play !== false); });
  $('#replay').onclick = function () { play(0); };
  $('#mute').onclick = function () { audio.muted = !audio.muted; this.classList.toggle('off', audio.muted); };
  document.addEventListener('visibilitychange', function () { if (document.hidden) audio.pause(); else if (playing && audio.src && D.music_enabled !== false && !PV) audio.play().catch(function () {}); });
  function ready() { return Promise.all([document.fonts ? document.fonts.ready : 0].concat($$('img').map(function (im) { return im.decode ? im.decode().catch(function () {}) : 0; }))); }
  loadData().then(function (d) { D = d; render(D); if (D.music_url && D.music_enabled !== false) audio.src = D.music_url; return ready(); }).then(function () {
    fitBoxes(); build();
    var t0 = parseFloat(Q.get('t') || '0') || 0;
    if (PV) { $('#start').classList.add('out'); if (Q.get('hold') === '1') JFYPlayer.seek(t0, false); else play(t0); return; }
    t = 0; draw();
    $('#startBtn').onclick = function () { $('#start').classList.add('out'); play(0); };
  });
})();
