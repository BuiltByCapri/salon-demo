// Booking flow: guests, services, stylist, time, confirm. Uses SALON and the helpers in salon.js.
const T = {
  demoBar: { en: "An example booking page for a made-up salon.", es: "Página de reservas de ejemplo para un salón ficticio." },
  tourBtn: { en: "Take the tour", es: "Ver el recorrido" },
  backSite: { en: "Back to site", es: "Volver al sitio" },
  back: { en: "Back", es: "Atrás" },
  next: { en: "Next", es: "Siguiente" },
  pay: { en: "Pay $%s & book", es: "Pagar $%s y reservar" },
  stepNames: { en: ["Guests", "Services", "Stylist", "Time", "Confirm"], es: ["Personas", "Servicios", "Estilista", "Hora", "Confirmar"] },
  edit: { en: "Edit", es: "Cambiar" },
  q0: { en: "How many people are coming?", es: "¿Cuántas personas vienen?" },
  q1: { en: "What are we doing today?", es: "¿Qué te vamos a hacer?" },
  q2: { en: "Who would you like to see?", es: "¿Con quién quieres tu cita?" },
  q3: { en: "When works for you?", es: "¿Cuándo te queda bien?" },
  q4: { en: "Almost done", es: "Ya casi" },
  person: { en: "person", es: "persona" },
  people: { en: "people", es: "personas" },
  bigGroup: { en: "5 or more? Message us on WhatsApp", es: "¿5 o más? Escríbenos por WhatsApp" },
  guest: { en: "Guest", es: "Persona" },
  you: { en: "You", es: "Tú" },
  anyone: { en: "Anyone", es: "Cualquiera" },
  anyoneSub: { en: "First available", es: "La primera libre" },
  anyArt: { en: "Any<br>stylist", es: "Cualquier<br>estilista" },
  nextOpen: { en: "Next:", es: "Próximo:" },
  sameTech: { en: "Two guests picked the same stylist. Each guest needs their own, so choose another or pick Anyone.", es: "Dos personas escogieron la misma estilista. Cada una necesita la suya: escoge otra o Cualquiera." },
  times: { en: "Open times", es: "Horas libres" },
  noneGroup: { en: "There's no time when everyone can be seen together with these choices. Try Anyone for a stylist, a different service, or message us on WhatsApp and we'll fit you in.", es: "Con estas opciones no hay una hora en que todas puedan ir juntas. Prueba Cualquiera como estilista, otro servicio, o escríbenos por WhatsApp y te acomodamos." },
  noneOne: { en: "This stylist is fully booked for now. Try Anyone, or message us on WhatsApp.", es: "Esta estilista está llena por ahora. Prueba Cualquiera, o escríbenos por WhatsApp." },
  timesGroup: { en: "Times when your whole group can be seen together", es: "Horas en que todo el grupo puede ir junto" },
  pickDay: { en: "Pick a day to see the times.", es: "Escoge un día para ver las horas." },
  summary: { en: "Your visit", es: "Tu cita" },
  when: { en: "When", es: "Cuándo" },
  total: { en: "Total", es: "Total" },
  with: { en: "with", es: "con" },
  details: { en: "Your details", es: "Tus datos" },
  name: { en: "Name", es: "Nombre" },
  phone: { en: "Phone", es: "Teléfono" },
  dep: { en: "A <b>$%s deposit</b> ($20 per guest) holds your spot and comes off your total. Example only: nothing is charged.", es: "Un <b>depósito de $%s</b> ($20 por persona) asegura tu cita y se descuenta del total. Es un ejemplo: no se cobra nada." },
  hints: {
    en: ["Booking for a group? Everyone is seen at the same time.", "Pick a service for each person.", "Choose a stylist, or Anyone for the first opening.", "Days in pink have openings.", "We'll text your confirmation."],
    es: ["¿Vienen en grupo? Todas las atienden a la misma hora.", "Escoge un servicio para cada persona.", "Escoge una estilista, o Cualquiera para la primera libre.", "Los días en rosa tienen espacio.", "Te mandamos la confirmación por texto."],
  },
  doneH: { en: "You're booked.", es: "¡Listo, nos vemos!" },
  doneP: { en: "We've texted your confirmation, and we'll remind you the day before. See you at Casa Luz.", es: "Te mandamos la confirmación por texto y un recordatorio el día antes. Nos vemos en Casa Luz." },
  home: { en: "Back to Casa Luz", es: "Volver a Casa Luz" },
  days: { en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] },
  tour: {
    en: [
      ["#steps", "Booking lives on its own page, one step at a time, so it's simple on a phone."],
      [".guests", "First: how many people. Groups are booked together, so friends and moms with daughters can come at the same time."],
      ["#main .view", "Each person picks their own service, with time and price."],
      ["#main .view", "Then their stylist, or Anyone. Each card shows that stylist's next opening."],
      [".when", "Only times when everyone can be seen together show up. No back and forth on WhatsApp."],
      [".confirm", "They see everything before paying, then put down a deposit so no-shows cost you less."],
      ["#bottom", "Back and Next always stay in the same spot."],
    ],
    es: [
      ["#steps", "La reserva tiene su propia página, un paso a la vez, así es fácil desde el teléfono."],
      [".guests", "Primero: cuántas personas. Los grupos se reservan juntos, para que amigas o mamá e hija vengan a la misma hora."],
      ["#main .view", "Cada persona escoge su servicio, con tiempo y precio."],
      ["#main .view", "Después su estilista, o Cualquiera. Cada tarjeta muestra su próximo espacio libre."],
      [".when", "Solo aparecen horas en que todas pueden ir juntas. Nada de ir y venir por WhatsApp."],
      [".confirm", "Ven todo antes de pagar, y dejan un depósito para que no se pierdan citas."],
      ["#bottom", "Atrás y Siguiente siempre están en el mismo lugar."],
    ],
  },
  tourNext: { en: "Next", es: "Siguiente" },
  tourDone: { en: "Done", es: "Listo" },
  tourSkip: { en: "Skip", es: "Saltar" },
};

let lang = "en";
const qs = new URLSearchParams(location.search);
const S = { step: 0, guests: 0, g: [], day: null, time: null, month: 0, done: false };
const blank = () => ({ svc: null, tech: null });
// Coming from a stylist or service on the site starts the first guest with that choice.
const preTech = SALON.techs.some((x) => x.id === qs.get("tech")) ? qs.get("tech") : null;
const preSvc = SALON.services[qs.get("svc")] ? qs.get("svc") : null;

const $ = (s) => document.querySelector(s);
const t = (k) => T[k][lang];
const fill = (k, v) => t(k).replace("%s", v);
const loc = () => (lang === "es" ? "es-US" : "en-US");
const tech = (id) => SALON.techs.find((x) => x.id === id);
const doers = (svc) => SALON.techs.filter((x) => x.svcs.includes(svc)).map((x) => x.id);
const label = (i) => (S.guests === 1 ? "" : i === 0 ? t("you") : `${t("guest")} ${i + 1}`);
const dupTech = () => { const ids = S.g.map((x) => x.tech).filter((x) => x && x !== "any"); return new Set(ids).size !== ids.length; };

function setGuests(n) {
  const g = S.g.slice(0, n);
  while (g.length < n) g.push(blank());
  if (n && !S.g.length) { g[0].tech = preTech; g[0].svc = preSvc; }
  Object.assign(S, { guests: n, g, day: null, time: null });
}

// Is there a way to give every guest a different stylist who does their service and is free then?
function assign(d, h, m) {
  const free = (id) => slots(id, d).some((s) => s.h === h && s.m === m && !s.taken);
  const out = [];
  const go = (i, used) => {
    if (i === S.g.length) return true;
    const want = S.g[i].tech && S.g[i].tech !== "any" ? [S.g[i].tech] : doers(S.g[i].svc);
    for (const id of want) if (!used.has(id) && free(id)) { out[i] = id; used.add(id); if (go(i + 1, used)) return true; used.delete(id); }
    return false;
  };
  return go(0, new Set()) ? out : null;
}
function times(d) {
  const [open, close] = SALON.hours[d.getDay()];
  if (open == null || d < today || d > addDays(today, 45)) return [];
  const out = [];
  for (let h = open; h < close; h++) for (const m of [0, 30]) out.push({ h, m, ok: !!assign(d, h, m) });
  return out;
}
const when = (d, s) => `${d.toLocaleDateString(loc(), { weekday: "short", month: "short", day: "numeric" })}, ${ampm(s.h, s.m)}`;

function words() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-t]").forEach((el) => (el.textContent = T[el.dataset.t][lang]));
  document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
}

function progress() {
  const names = t("stepNames");
  const pct = S.done ? 1 : S.step / (names.length - 1);
  $("#steps").innerHTML = `<span class="fill" style="width:calc((100% - 28px) * ${pct})"></span>` + names.map((n, i) => {
    const past = S.done || i < S.step;
    return `<div class="st ${past ? "past" : i === S.step ? "now" : ""}"><span class="dot">${past ? "✓" : i + 1}</span>${n}${past && !S.done ? `<button type="button" class="edit" data-go="${i}">${t("edit")}</button>` : ""}</div>`;
  }).join("");
  $("#steps").querySelectorAll(".edit").forEach((b) => b.onclick = () => { S.step = +b.dataset.go; render(); });
}

const svcTile = (k, i) => { const s = SALON.services[k]; return `<button type="button" class="svc" data-g="${i}" data-k="${k}" aria-pressed="${S.g[i].svc === k}"><span><b>${s[lang]}</b><span>${mins(s.mins)}</span></span><span class="price">$${s.price}</span></button>`; };
const svcKeys = (i) => (i === 0 && preTech && S.g[0].tech === preTech ? tech(preTech).svcs : Object.keys(SALON.services));

const views = [
  () => `<h1 class="q">${t("q0")}</h1><div class="guests">${[1, 2, 3, 4].map((n) => `<button type="button" class="gt" data-n="${n}" aria-pressed="${S.guests === n}"><span>${n}<small>${n === 1 ? t("person") : t("people")}</small></span></button>`).join("")}</div>
    <a class="more-g" href="#" onclick="return false">${t("bigGroup")} <span>›</span></a>`,
  () => `<h1 class="q">${t("q1")}</h1>${S.g.map((g, i) => `<div class="gblock">${S.guests > 1 ? `<p class="gname">${label(i)}</p>` : ""}<div class="svcs">${svcKeys(i).map((k) => svcTile(k, i)).join("")}</div></div>`).join("")}`,
  () => {
    if (S.guests === 1) {
      const ids = doers(S.g[0].svc);
      return `<h1 class="q">${t("q2")}</h1><div class="techs">
        <button type="button" class="tile" data-g="0" data-id="any" aria-pressed="${S.g[0].tech === "any"}"><div class="any">${t("anyArt")}</div><b>${t("anyone")}</b><span>${t("anyoneSub")}</span></button>
        ${ids.map((id) => { const x = tech(id), n = nextOpening(id); return `<button type="button" class="tile" data-g="0" data-id="${id}" aria-pressed="${S.g[0].tech === id}"><img src="${x.img}" alt="" /><b>${x.name}</b><span>${x.role[lang]}</span>${n ? `<span class="soon">${t("nextOpen")} ${when(n.d, n.s)}</span>` : ""}</button>`; }).join("")}
      </div>`;
    }
    return `<h1 class="q">${t("q2")}</h1>${S.g.map((g, i) => `<div class="gblock"><p class="gname">${label(i)} <span>${SALON.services[g.svc][lang]}</span></p><div class="pick">
        <button type="button" class="pchip" data-g="${i}" data-id="any" aria-pressed="${g.tech === "any"}"><span class="ai">✦</span>${t("anyone")}</button>
        ${doers(g.svc).map((id) => `<button type="button" class="pchip" data-g="${i}" data-id="${id}" aria-pressed="${g.tech === id}"><img src="${tech(id).img}" alt="" />${tech(id).name}</button>`).join("")}
      </div></div>`).join("")}${dupTech() ? `<p class="warn">${t("sameTech")}</p>` : ""}`;
  },
  () => {
    const base = new Date(today.getFullYear(), today.getMonth() + S.month, 1);
    let cal = T.days[lang].map((d) => `<span class="dow">${d}</span>`).join("");
    for (let i = 0; i < base.getDay(); i++) cal += "<span></span>";
    const n = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= n; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), i);
      const open = times(d).some((s) => s.ok);
      cal += `<button type="button" class="day${open ? " open" : ""}" data-k="${dayKey(d)}" ${open ? "" : "disabled"} aria-pressed="${S.day === dayKey(d)}">${i}</button>`;
    }
    const list = !S.day ? `<p class="empty">${t("pickDay")}</p>` : `<div class="times">${times(fromKey(S.day)).map((s) => { const k = `${s.h}:${s.m}`; return `<button type="button" class="time" data-k="${k}" ${s.ok ? "" : "disabled"} aria-pressed="${S.time === k}">${ampm(s.h, s.m)}</button>`; }).join("")}</div>`;
    const anyOpen = [0, 1].some((mo) => { const b = new Date(today.getFullYear(), today.getMonth() + mo, 1); const last = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate(); for (let i = 1; i <= last; i++) if (times(new Date(b.getFullYear(), b.getMonth(), i)).some((s) => s.ok)) return true; return false; });
    if (!anyOpen) return `<h1 class="q">${t("q3")}</h1><p class="warn" style="max-width:34rem;margin:0 auto">${S.guests > 1 ? t("noneGroup") : t("noneOne")}</p>`;
    return `<h1 class="q">${t("q3")}</h1><div class="when">
      <div><div class="cal-head"><button type="button" id="prev" ${S.month === 0 ? "disabled" : ""} aria-label="Previous month">‹</button><b>${base.toLocaleDateString(loc(), { month: "long", year: "numeric" })}</b><button type="button" id="next" ${S.month >= 1 ? "disabled" : ""} aria-label="Next month">›</button></div><div class="grid">${cal}</div></div>
      <div><p class="times-h">${S.guests > 1 ? t("timesGroup") : t("times")}</p>${list}</div></div>`;
  },
  () => {
    const [h, m] = S.time.split(":").map(Number);
    const d = fromKey(S.day), who = assign(d, h, m);
    const total = S.g.reduce((a, g) => a + SALON.services[g.svc].price, 0);
    return `<h1 class="q">${t("q4")}</h1><div class="confirm">
      <div class="card"><h3>${t("summary")}</h3>
        ${S.g.map((g, i) => { const x = tech(who[i]); return `<div class="with"><img src="${x.img}" alt="" /><span><b>${SALON.services[g.svc][lang]}</b><br><span class="who">${S.guests > 1 ? `${label(i)} · ` : ""}${t("with")} ${x.name} · $${SALON.services[g.svc].price}</span></span></div>`; }).join("")}
        <div class="row"><span>${t("when")}</span><span>${d.toLocaleDateString(loc(), { weekday: "short", month: "long", day: "numeric" })}, ${ampm(h, m)}</span></div>
        <div class="row"><span>${t("total")}</span><span>$${total}</span></div>
      </div>
      <div class="card"><h3>${t("details")}</h3>
        <div class="fields"><label>${t("name")}<input id="nm" autocomplete="name" /></label><label>${t("phone")}<input id="ph" inputmode="tel" autocomplete="tel" /></label></div>
        <p class="dep">${fill("dep", SALON.deposit * S.guests)}</p>
      </div></div>`;
  },
];

function canNext() {
  switch (S.step) {
    case 0: return S.guests > 0;
    case 1: return S.g.every((g) => g.svc);
    case 2: return S.g.every((g) => g.tech) && !dupTech();
    case 3: return !!S.time;
    default: return !!($("#nm") && $("#nm").value.trim() && $("#ph").value.replace(/\D/g, "").length >= 7);
  }
}
const syncNext = () => ($("#nextBtn").disabled = !canNext());

let shownStep = -1;
function render() {
  words(); progress();
  if (S.done) {
    $("#main").innerHTML = `<div class="done view"><div class="check">✓</div><h2>${t("doneH")}</h2><p>${t("doneP")}</p><a class="home" href="index.html">${t("home")}</a></div>`;
    $("#bottom").style.display = "none";
    return;
  }
  $("#bottom").style.display = "";
  // Fade in only when the step changes, so picking something doesn't flash the page.
  const fresh = shownStep !== S.step;
  shownStep = S.step;
  $("#main").innerHTML = `<div class="view${fresh ? " enter" : ""}">${views[S.step]()}</div>`;
  $("#hint").textContent = S.step === 1 && S.guests === 1 ? (lang === "es" ? "Escoge tu servicio." : "Pick your service.") : t("hints")[S.step];
  $("#backBtn").style.visibility = S.step === 0 ? "hidden" : "visible";
  $("#nextBtn").textContent = S.step === 4 ? fill("pay", SALON.deposit * S.guests) : t("next");

  $("#main").querySelectorAll(".gt").forEach((b) => b.onclick = () => { setGuests(+b.dataset.n); render(); });
  $("#main").querySelectorAll(".svc").forEach((b) => b.onclick = () => {
    const g = S.g[+b.dataset.g];
    g.svc = b.dataset.k;
    if (g.tech && g.tech !== "any" && !tech(g.tech).svcs.includes(g.svc)) g.tech = null;
    S.day = S.time = null; render();
  });
  $("#main").querySelectorAll(".tile, .pchip").forEach((b) => b.onclick = () => { S.g[+b.dataset.g].tech = b.dataset.id; S.day = S.time = null; render(); });
  $("#main").querySelectorAll(".day.open").forEach((b) => b.onclick = () => { S.day = b.dataset.k; S.time = null; render(); });
  $("#main").querySelectorAll(".time:not(:disabled)").forEach((b) => b.onclick = () => { S.time = b.dataset.k; render(); });
  if ($("#prev")) { $("#prev").onclick = () => { S.month = 0; render(); }; $("#next").onclick = () => { S.month = 1; render(); }; }
  if ($("#nm")) { $("#nm").oninput = syncNext; $("#ph").oninput = syncNext; }
  syncNext();
}

$("#nextBtn").onclick = () => { if (S.step === 4) S.done = true; else S.step++; scrollTo(0, 0); render(); };
$("#backBtn").onclick = () => { S.step = Math.max(0, S.step - 1); render(); };
document.querySelectorAll(".lang button").forEach((b) => b.onclick = () => { lang = b.dataset.lang; render(); if (tourOn) showStep(); });

// ---------- Guided tour: walks a sample booking for two through every step ----------
let tourOn = false, step = 0;
const dim = document.createElement("div"); dim.className = "tour-dim"; dim.innerHTML = '<div class="tour-ring"></div>';
const tip = document.createElement("div"); tip.className = "tour-tip"; tip.setAttribute("role", "dialog");
const tourStep = [0, 0, 1, 2, 3, 4, 4];
function prep(i) {
  S.done = false;
  if (i >= 1 && !S.guests) { setGuests(2); }
  if (i >= 3 && !S.g.every((g) => g.svc)) { S.g[0].svc = "balayage"; S.g[1].svc = "gel"; }
  if (i >= 4 && !S.g.every((g) => g.tech)) { S.g[0].tech = "valeria"; S.g[1].tech = "any"; }
  if (i >= 4 && !S.day) for (let n = 0; n < 30; n++) { const d = addDays(today, n); if (times(d).some((s) => s.ok)) { S.day = dayKey(d); break; } }
  if (i >= 5 && !S.time) { const s = times(fromKey(S.day)).find((x) => x.ok); S.time = `${s.h}:${s.m}`; }
  S.step = tourStep[i];
  render();
}
let target = null;
function place() {
  if (!tourOn || !target) return;
  const r = target.getBoundingClientRect();
  Object.assign(dim.firstChild.style, { top: r.top - 6 + "px", left: r.left - 6 + "px", width: r.width + 12 + "px", height: r.height + 12 + "px" });
  const h = tip.offsetHeight, w = tip.offsetWidth;
  let top = r.bottom + 16 + h < innerHeight - 80 ? r.bottom + 16 : r.top - 16 - h;
  if (top < 16 || top + h > innerHeight - 16) top = 16;
  tip.style.top = top + "px";
  tip.style.left = Math.min(Math.max(16, r.left), innerWidth - w - 16) + "px";
}
function showStep() {
  const steps = T.tour[lang];
  prep(step);
  target = $(steps[step][0]);
  tip.innerHTML = `<p class="n">${step + 1} / ${steps.length}</p><p>${steps[step][1]}</p>
    <div class="act"><button type="button" id="tSkip">${t("tourSkip")}</button><button type="button" class="go" id="tNext">${step === steps.length - 1 ? t("tourDone") : t("tourNext")}</button></div>`;
  $("#tNext").onclick = () => (step === steps.length - 1 ? endTour() : (step++, showStep()));
  $("#tSkip").onclick = endTour;
  const r = target.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight - 80) target.scrollIntoView({ behavior: "smooth", block: "center" });
  place();
  $("#tNext").focus({ preventScroll: true });
}
function startTour() { tourOn = true; step = 0; Object.assign(S, { step: 0, guests: 0, g: [], day: null, time: null, done: false }); document.body.append(dim, tip); showStep(); }
function endTour() {
  tourOn = false; target = null; dim.remove(); tip.remove();
  Object.assign(S, { step: 0, guests: 0, g: [], day: null, time: null }); render();
  try { localStorage.setItem("casaluz-book-toured", "1"); } catch {}
}
// The highlight follows the page while it scrolls, so there's no waiting between steps.
addEventListener("scroll", () => requestAnimationFrame(place), { passive: true });
addEventListener("resize", place);
addEventListener("keydown", (e) => { if (tourOn && e.key === "Escape") endTour(); });
$("#tourBtn").onclick = startTour;

render();
let seen = false; try { seen = localStorage.getItem("casaluz-book-toured") === "1"; } catch {}
if (!seen && !preTech && !preSvc) setTimeout(startTour, 500);
