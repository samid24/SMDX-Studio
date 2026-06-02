// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .portfolio-item, .service-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); cursorRing.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
});

// ── NAV ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});
function closeMobile() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
}

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCount(el, target) {
    let start = 0;
    const dur = 1800;
    const startTime = performance.now();
    const suffix = el.dataset.suffix || (target === 98 ? '%' : target === 4 ? '+' : '+');
    function step(now) {
        const p = Math.min((now - startTime) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(start + (target - start) * ease) + suffix;
        if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            document.querySelectorAll('[data-count]').forEach(el => {
                animateCount(el, parseInt(el.dataset.count));
            });
            statObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.about-stats');
if (statsSection) statObserver.observe(statsSection);

// ── PORTFOLIO FILTERS ──
const filterBtns = document.querySelectorAll('.filter-btn');
const portItems = document.querySelectorAll('.portfolio-item');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        portItems.forEach(item => {
            const show = filter === 'all' || item.dataset.cat === filter;
            item.style.opacity = show ? '1' : '0.2';
            item.style.pointerEvents = show ? 'auto' : 'none';
        });
    });
});

// ── FORM SUBMIT ──
function submitForm() {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
}

// ── CANVAS ART: ABOUT ──
(function () {
    const canvas = document.getElementById('aboutCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 480;
    canvas.height = canvas.offsetHeight || 600;
    const W = canvas.width, H = canvas.height;

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Accent circle glow
    const grd = ctx.createRadialGradient(W * .6, H * .4, 0, W * .6, H * .4, W * .5);
    grd.addColorStop(0, 'rgba(200,169,110,0.14)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Diagonal accent stroke
    ctx.save();
    ctx.strokeStyle = 'rgba(200,169,110,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 16]);
    ctx.beginPath(); ctx.moveTo(W * .1, H * .8); ctx.lineTo(W * .9, H * .2); ctx.stroke();
    ctx.restore();

    // Floating rectangles
    [[.25, .35, .22, .28, 'rgba(200,169,110,0.08)'], [.55, .5, .18, .3, 'rgba(139,92,246,0.07)'], [.15, .55, .12, .18, 'rgba(200,169,110,0.12)']].forEach(([rx, ry, rw, rh, col]) => {
        ctx.fillStyle = col;
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.fillRect(rx * W, ry * H, rw * W, rh * H);
        ctx.strokeRect(rx * W, ry * H, rw * W, rh * H);
    });

    // Large text watermark
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.font = `bold ${W * .28}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SMDX', W * .5, H * .5);
    ctx.restore();

    // Corner marks
    [[0, 0], [W, 0], [0, H], [W, H]].forEach(([cx, cy]) => {
        ctx.strokeStyle = 'rgba(200,169,110,0.5)';
        ctx.lineWidth = 1.5;
        const s = 18, pad = 12;
        const dx = cx === 0 ? pad : -pad, dy = cy === 0 ? pad : -pad;
        ctx.beginPath();
        ctx.moveTo(cx + dx + s * (cx === 0 ? 1 : -1), cy + dy);
        ctx.lineTo(cx + dx, cy + dy);
        ctx.lineTo(cx + dx, cy + dy + s * (cy === 0 ? 1 : -1));
        ctx.stroke();
    });
})();

// ── CANVAS ART: PORTFOLIO ──
const portPalettes = [
    ['#c8a96e', '#1a1a1a', '#2e2e2e', '#8b5cf6'],
    ['#6e9ec8', '#0a0f1a', '#1a2a3a', '#c8a96e'],
    ['#a96ec8', '#1a0a1a', '#2e1a3a', '#6ec8a9'],
    ['#6ec8a9', '#0a1a14', '#1a2e26', '#c8a96e'],
    ['#c86e6e', '#1a0a0a', '#2e1a1a', '#6e9ec8'],
    ['#c8c86e', '#1a1a0a', '#2e2e1a', '#c86e9e'],
];

['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].forEach((id, i) => {
    const c = document.getElementById(id);
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const pal = portPalettes[i];

    ctx.fillStyle = pal[1]; ctx.fillRect(0, 0, W, H);

    // Gradient overlay
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, pal[1] + 'ee'); g.addColorStop(1, pal[2] + 'cc');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Glow circle
    const gr = ctx.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .4, W * .5);
    gr.addColorStop(0, pal[0] + '22'); gr.addColorStop(1, 'transparent');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);

    // Shapes
    ctx.fillStyle = pal[0] + '18'; ctx.strokeStyle = pal[0] + '30'; ctx.lineWidth = 1;
    ctx.fillRect(W * .2, H * .2, W * .3, H * .35); ctx.strokeRect(W * .2, H * .2, W * .3, H * .35);
    ctx.fillStyle = pal[3] + '12'; ctx.strokeStyle = pal[3] + '22';
    ctx.fillRect(W * .45, H * .35, W * .25, H * .3); ctx.strokeRect(W * .45, H * .35, W * .25, H * .3);

    // Text
    ctx.fillStyle = pal[0] + '22'; ctx.font = `bold ${W * .12}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(['LUMI', 'NOVA', 'EMBE', 'ARCA', 'PULS', 'BLOM'][i], W * .5, H * .5);

    // Diagonal line
    ctx.strokeStyle = pal[0] + '40'; ctx.lineWidth = 1; ctx.setLineDash([6, 12]);
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, 0); ctx.stroke();
    ctx.setLineDash([]);

    // Corner marks
    [[0, 0], [W, 0], [0, H], [W, H]].forEach(([cx, cy]) => {
        ctx.strokeStyle = pal[0] + '80'; ctx.lineWidth = 1.5;
        const s = 14, p = 10; const dx = cx ? -p : p, dy = cy ? -p : p;
        ctx.beginPath();
        ctx.moveTo(cx + dx + (cx ? -s : s), cy + dy); ctx.lineTo(cx + dx, cy + dy); ctx.lineTo(cx + dx, cy + dy + (cy ? -s : s));
        ctx.stroke();
    });
});