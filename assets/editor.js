/* Editor for the video invitation kit — form built from config → live preview (seeks to the scene you edit) → shareable #data link. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var CFG = window.JFY_CFG, SAMPLE = JSON.parse(JSON.stringify(window.JFY_DATA || {}));
  var S = CFG.scenes, mid = function (i) { var t1 = i < S.length - 1 ? S[i + 1].t0 : CFG.dur; return +(Math.min(t1 - .4, S[i].t0 + 2.2)).toFixed(2); };
  var find = function (type) { for (var i = 0; i < S.length; i++) if (S[i].type === type) return i; return -1; };
  var bf = CFG.brideFirst !== false;
  $('#tplName').textContent = CFG.name; $('#tplSub').textContent = 'Animated video invitation · ' + Math.round(CFG.dur) + ' s';
  document.title = 'Customize your ' + CFG.name + ' video invitation — Just For You';
  function inp(name, label, o) { o = o || {}; var opt = o.req ? ' *' : (o.hint ? ' <i>(' + o.hint + ')</i>' : ' <i>(optional)</i>');
    if (o.area) return '<label>' + label + opt + '<textarea name="' + name + '" rows="' + (o.rows || 3) + '" maxlength="' + (o.max || 300) + '"></textarea></label>';
    return '<label>' + label + opt + '<input ' + (o.type ? 'type="' + o.type + '" ' : '') + 'name="' + name + '" maxlength="' + (o.max || 60) + '"' + (o.req ? ' required' : '') + (o.ph ? ' placeholder="' + o.ph + '"' : '') + '></label>'; }
  var g = '', ti = find('title'), ni = find('names'), ri = find('rsvp');
  var nm = bf ? [inp('bride_name', "Bride's name", { req: 1, max: 24 }), inp('groom_name', "Groom's name", { req: 1, max: 24 })] : [inp('groom_name', "Groom's name", { req: 1, max: 24 }), inp('bride_name', "Bride's name", { req: 1, max: 24 })];
  g += '<details class="grp" open data-seek="' + (ti >= 0 ? mid(ti) : 2) + '"><summary>💑 The Couple</summary>' + (ti >= 0 ? inp('intro_line', 'Title line', { max: 40, ph: 'Wedding Invitation of' }) : '') + '<div class="row2">' + nm.join('') + '</div></details>';
  if (ni >= 0) g += '<details class="grp" data-seek="' + mid(ni) + '"><summary>💌 Invitation &amp; Parents</summary>' + inp('invite_text', 'Invitation lines', { area: 1, rows: 3, hint: 'one line each' }) +
    inp('bride_parents', "Bride's parents", { max: 70, ph: 'D/o Mrs. … & Mr. …' }) + inp('groom_parents', "Groom's parents", { max: 70, ph: 'S/o Mrs. … & Mr. …' }) + inp('weds_word', 'Word between the names', { max: 12, ph: 'weds' }) + '</details>';
  S.forEach(function (sc, i) {
    if (sc.type !== 'event') return; var e = sc.ev;
    g += '<details class="grp" data-seek="' + mid(i) + '"><summary>' + (sc.icon || '🎉') + ' Scene ' + (i + 1) + ' · ' + (sc.label || 'Event') + '</summary>' +
      '<label>Event name <i>(optional)</i><input data-e="' + e + '" data-k="title" maxlength="32"></label>' +
      '<div class="row2"><label>Date <i>(day of week is automatic)</i><input type="date" data-e="' + e + '" data-k="date"></label><label>Time <i>(as you want it shown)</i><input data-e="' + e + '" data-k="time" maxlength="14" placeholder="7:00 PM"></label></div>' +
      '<label>Venue <i>(optional)</i><input data-e="' + e + '" data-k="venue" maxlength="60"></label></details>';
  });
  if (ri >= 0) g += '<details class="grp" data-seek="' + mid(ri) + '"><summary>💐 RSVP &amp; Family</summary><div class="row2">' + inp('rsvp_kindly', 'Small line above RSVP', { max: 20, ph: 'Kindly' }) + inp('rsvp_word', 'Big word', { max: 14, ph: 'RSVP' }) + '</div>' +
    inp('rsvp_by', 'RSVP by date', { type: 'date' }) + inp('compliments', 'Line above family name', { max: 40, ph: 'Best Compliments From' }) + inp('family_name', 'Family name', { max: 40 }) + inp('contact', 'Contact number / line', { max: 40 }) + '</details>';
  g += '<details class="grp" data-seek="' + (CFG.dur - .3) + '"><summary>✅ WhatsApp RSVP, Map &amp; Music</summary>' + inp('rsvp_whatsapp', 'WhatsApp number for RSVPs', { type: 'tel', max: 16, hint: 'with country code', ph: '919876543210' }) +
    inp('venue_map_url', 'Google Maps link', { type: 'url', max: 300, hint: 'optional — made from the first venue if empty', ph: 'https://maps.app.goo.gl/…' }) +
    '<label class="tog"><input type="checkbox" name="music_enabled" checked><span></span>Background music (' + (CFG.musicLabel || 'included') + ')</label></details>';
  $('#groups').innerHTML = g;
  var form = $('#ed'), TEXT = $$('[name]', form).filter(function (x) { return x.name !== 'music_enabled'; }).map(function (x) { return x.name; });
  var NE = S.filter(function (s) { return s.type === 'event'; }).length, timer = null, seekT = +$('details[data-seek]').dataset.seek, n = 0, DRAFT = 'jfy-' + CFG.id + '-draft';
  function load(d) {
    TEXT.forEach(function (k) { form[k].value = d[k] || ''; });
    form.music_enabled.checked = d.music_enabled !== false;
    $$('[data-e]').forEach(function (i) { var e = (d.events || [])[+i.dataset.e] || {}; i.value = e[i.dataset.k] || ''; });
  }
  function collect() {
    var d = {};
    TEXT.forEach(function (k) { var v = (form[k].value || '').trim(); if (v) d[k] = v; });
    if (d.rsvp_whatsapp) d.rsvp_whatsapp = d.rsvp_whatsapp.replace(/\D/g, '');
    if (!form.music_enabled.checked) d.music_enabled = false;
    d.events = []; for (var i = 0; i < NE; i++) { var e = {}; $$('[data-e="' + i + '"]').forEach(function (x) { var v = x.value.trim(); if (v) e[x.dataset.k] = v; }); d.events.push(e); }
    return d;
  }
  function send(t) { try { $('#pv').contentWindow.postMessage({ type: 'jfy:seek', t: Math.max(0, t) }, '*'); } catch (_) {} }
  function preview() {
    var d = collect(); try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch (e) {}
    JFYCodec.encode(d).then(function (s) { $('#pv').src = 'index.html?preview=1&hold=1&t=' + seekT + '&r=' + (++n) + '#data=' + s; });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(preview, 550); }
  form.addEventListener('input', schedule); form.addEventListener('change', schedule);
  function sceneStart(t) { var s = 0; S.forEach(function (x) { if (x.t0 <= t) s = x.t0; }); return s; }
  form.addEventListener('focusin', function (e) { var gg = e.target.closest('[data-seek]'); if (!gg) return; var t = +gg.dataset.seek; if (t === seekT) return; seekT = t; send(t); });
  $$('details[data-seek]').forEach(function (gg) { gg.addEventListener('toggle', function () { if (gg.open) { seekT = +gg.dataset.seek; send(seekT); } }); });
  $('#pvPlay').onclick = function () { send(0); };
  $('#pvScene').onclick = function () { send(sceneStart(seekT)); };
  $('#resetBtn').onclick = function () { load(SAMPLE); preview(); };
  $('#clearBtn').onclick = function () { load({ events: [] }); preview(); };
  function showErr(t) { var e = $('#err'); e.textContent = t; e.hidden = !t; }
  $('#createBtn').onclick = function () {
    var d = collect(), miss = [];
    [['bride_name', "Bride's name"], ['groom_name', "Groom's name"]].forEach(function (p) { if (!d[p[0]]) miss.push(p[1]); });
    if (miss.length) { showErr('Please fill: ' + miss.join(', ')); document.body.classList.remove('v-preview'); var f = form.querySelector(':invalid'); if (f) { f.closest('details').open = true; f.focus(); } return; }
    showErr('');
    JFYCodec.encode(d).then(function (s) {
      var u = new URL('index.html', location.href); u.search = ''; u.hash = 'data=' + s;
      var link = u.toString(), names = bf ? d.bride_name + ' & ' + d.groom_name : d.groom_name + ' & ' + d.bride_name, msg = 'You are invited to the wedding of ' + names + ' 💐\nOpen your invitation: ' + link;
      $('#shareUrl').value = link; $('#openLink').href = link; $('#waShare').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
      var ns = $('#nativeShare'); ns.hidden = !navigator.share; ns.onclick = function () { navigator.share({ title: 'Wedding invitation', text: msg.split('\n')[0], url: link }).catch(function () {}); };
      $('#sheet').hidden = false;
    });
  };
  $('#copyBtn').onclick = function () {
    var i = $('#shareUrl'), b = this; i.select();
    var ok = function () { b.textContent = 'Copied ✓'; setTimeout(function () { b.textContent = 'Copy'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(i.value).then(ok, function () { document.execCommand('copy'); ok(); }); else { document.execCommand('copy'); ok(); }
  };
  $('#sheetX').onclick = function () { $('#sheet').hidden = true; };
  $$('.tab').forEach(function (t) { t.onclick = function () { $$('.tab').forEach(function (x) { x.classList.toggle('on', x === t); }); document.body.classList.toggle('v-preview', t.dataset.view === 'preview'); window.scrollTo(0, 0); }; });
  var m = /[#&]data=([^&]+)/.exec(location.hash), start = Promise.resolve(null);
  if (m) start = JFYCodec.decode(m[1]).catch(function () { return null; });
  start.then(function (d) { if (!d) { try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (_) { d = null; } } load(d || SAMPLE); preview(); });
})();
