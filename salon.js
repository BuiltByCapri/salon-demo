// Shared by the site and the booking page. Swap this block per salon.
const IMG = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format`;

const SALON = {
  name: "Casa Luz",
  place: "Coral Way, Miami",
  deposit: 20,
  // Each stylist's week, Sunday first: [start hour, end hour], or null for a day off.
  // In a real build the salon edits these themselves.
  techs: [
    { id: "valeria", name: "Valeria", img: "img/valeria.jpg", role: { en: "Color and balayage", es: "Color y balayage" }, week: [null, null, [10, 19], [10, 19], [10, 20], [10, 20], [9, 17]], svcs: ["color", "balayage", "blowout", "cut"] },
    { id: "camila", name: "Camila", img: "img/camila.jpg", role: { en: "Cuts and blowouts", es: "Cortes y blowouts" }, week: [null, [10, 18], null, [10, 19], [12, 20], [9, 20], [9, 17]], svcs: ["cut", "blowout", "treatment", "color"] },
    { id: "marisol", name: "Marisol", img: "img/marisol.jpg", role: { en: "Nails and pedicures", es: "Uñas y pedicure" }, week: [null, [10, 18], [10, 18], [10, 18], [10, 18], [10, 18], [9, 15]], svcs: ["gel", "pedi", "brows"] },
    { id: "andrea", name: "Andrea", img: "img/andrea.jpg", role: { en: "Brows, lashes and nails", es: "Cejas, pestañas y uñas" }, week: [null, [12, 19], [12, 19], [12, 19], [12, 19], null, [9, 17]], svcs: ["brows", "lashes", "gel", "pedi"] },
  ],
  services: {
    cut: { en: "Cut and style", es: "Corte y secado", price: 65, mins: 60 },
    blowout: { en: "Blowout", es: "Blowout", price: 45, mins: 45 },
    color: { en: "Full color", es: "Color completo", price: 120, mins: 120 },
    balayage: { en: "Balayage", es: "Balayage", price: 220, mins: 180 },
    treatment: { en: "Keratin treatment", es: "Keratina", price: 180, mins: 150 },
    gel: { en: "Gel manicure", es: "Manicure en gel", price: 40, mins: 45 },
    pedi: { en: "Spa pedicure", es: "Pedicure spa", price: 55, mins: 60 },
    brows: { en: "Brow shaping", es: "Diseño de cejas", price: 35, mins: 30 },
    lashes: { en: "Lash lift", es: "Lifting de pestañas", price: 85, mins: 60 },
  },
  hours: [[null, null], [10, 19], [10, 19], [10, 19], [10, 20], [9, 20], [9, 17]],
};

const today = new Date(); today.setHours(0, 0, 0, 0);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fromKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const ampm = (h, m) => `${((h + 11) % 12) + 1}:${m ? "30" : "00"}${h < 12 ? "am" : "pm"}`;
const mins = (n) => (n < 60 ? `${n} min` : n % 60 ? `${Math.floor(n / 60)} h ${n % 60} min` : `${n / 60} h`);

// Made-up but steady availability: the same day always looks the same.
const seed = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
function slots(techId, d) {
  const tech = SALON.techs.find((x) => x.id === techId);
  const day = tech.week[d.getDay()];
  if (!day || d < today || d > addDays(today, 45)) return [];
  const [open, close] = day;
  const out = [];
  for (let h = open; h < close; h++) for (const m of [0, 30]) out.push({ h, m, taken: seed(techId + dayKey(d) + h + m) % 10 < 4 });
  if (seed(techId + dayKey(d)) % 7 === 0) out.forEach((s) => (s.taken = true));
  return out;
}
function nextOpening(techId) {
  for (let i = 0; i < 30; i++) { const d = addDays(today, i); const s = slots(techId, d).find((x) => !x.taken); if (s) return { d, s }; }
  return null;
}
