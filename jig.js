/* Schematic anatomy jig. Not an engineering drawing.
   1020 frames at 30 fps = 34.0s.
   Cuts at frames 150, 300, 510, 750. Doors move only across 151-175. */
(function () {
  const W = 1920, H = 1080, DEG = Math.PI / 180;
  const SHOTS = [
    { id: "01", title: "SKIN SEPARATION", sub: "RAM PANELS LIFT OFF TITANIUM STRUCTURE", color: "#E7E4DC" },
    { id: "02", title: "BAY DOORS", sub: "4000 PSI HYDRAULIC LINKAGES", color: "#F77F00" },
    { id: "03", title: "TRAPEZE DEPLOYMENT", sub: "AIM-120 CLASS INTO THE SLIPSTREAM", color: "#2A9D8F" },
    { id: "04", title: "2D PITCH VECTOR", sub: "FLAT C-D NOZZLE  ·  DIVERGENT FLAPS 20 DEG", color: "#00B4D8" },
    { id: "05", title: "COMBAT LOCK", sub: "SURFACES, VECTOR, AND BYPASS ON ONE CLOCK", color: "#E7E4DC" }
  ];
  const MAT = {
    ram: { hex: "#121316", rim: [176, 196, 208], rimStr: 0.55, edge: "rgba(214,224,232,0.34)" },
    ti: { hex: "#2F323A", rim: [198, 206, 214], rimStr: 0.42, edge: "rgba(226,230,236,0.32)" },
    gold: { hex: "#F77F00", emissive: 0.62, rim: [255, 214, 150], rimStr: 0.35, edge: "rgba(255,220,170,0.8)" },
    emerald: { hex: "#2A9D8F", emissive: 0.48, rim: [168, 255, 230], rimStr: 0.4, edge: "rgba(176,255,232,0.75)" },
    blue: { hex: "#00B4D8", emissive: 0.78, rim: [190, 248, 255], rimStr: 0.45, edge: "rgba(190,248,255,0.7)" },
    ceramic: { hex: "#6E675F", rim: [230, 220, 206], rimStr: 0.28, edge: "rgba(236,226,214,0.4)" },
    glass: { hex: "#0E2C34", alpha: 0.42, emissive: 0.25, rim: [0, 180, 216], rimStr: 0.7, edge: "rgba(0,180,216,0.55)" },
    bay: { hex: "#191C22", rim: [140, 150, 160], rimStr: 0.18, edge: "rgba(190,198,206,0.16)" },
    missile: { hex: "#5C6572", rim: [230, 234, 238], rimStr: 0.45, edge: "rgba(236,240,244,0.55)" },
    band: { hex: "#D5D8DE", emissive: 0.35, rim: [255, 255, 255], rimStr: 0.25, edge: "rgba(255,255,255,0.55)" },
    dark: { hex: "#0A0C10", rim: [80, 90, 100], rimStr: 0.1, edge: "rgba(160,170,180,0.2)" },
    hot: { hex: "#06343F", emissive: 0.55, rim: [0, 180, 216], rimStr: 0.65, edge: "rgba(0,180,216,0.45)" }
  };
  const BAY = { x0: 7.28, x1: 11.58, y: 0.78, z: -0.5 };
  const MSL = { x: 9.42, z: -0.2, half: 1.72, r: 0.15 };
  const KEYS = [
    { f: 0, eye: [-4.2, -13.6, 8.4], target: [7.6, 0.15, 0.15], fov: 30 },
    { f: 150, eye: [1.2, -11.4, 6.6], target: [8.4, 0.05, 0.2], fov: 28 },
    { f: 198, eye: [5.4, -9.6, 1.8], target: [9.0, 0.0, -0.15], fov: 32 },
    { f: 248, eye: [9.3, -4.8, -3.6], target: [9.4, 0.0, -0.35], fov: 36 },
    { f: 300, eye: [9.45, -0.2, -6.2], target: [9.4, 0.0, -0.35], fov: 40 },
    { f: 390, eye: [7.6, -4.4, -3.5], target: [9.5, 0.0, -1.05], fov: 30 },
    { f: 500, eye: [11.2, -4.0, -2.9], target: [9.55, 0.0, -1.35], fov: 28 },
    { f: 545, eye: [13.8, -7.2, 2.4], target: [17.5, 0.0, 0.0], fov: 28 },
    { f: 750, eye: [24.6, -4.2, 2.6], target: [17.6, 0.0, -0.15], fov: 26 },
    { f: 880, eye: [11.4, -17.4, 8.4], target: [8.2, 0.0, 0.12], fov: 32 },
    { f: 1019, eye: [5.6, -18.6, 9.2], target: [7.8, 0.0, 0.1], fov: 32 }
  ];
  const ST = [
    [0.0, 0.02, 0.02, 0.02, 0.06], [0.55, 0.18, 0.15, 0.1, 0.07], [1.45, 0.4, 0.3, 0.18, 0.04],
    [2.55, 0.66, 0.48, 0.28, -0.01], [3.7, 0.9, 0.6, 0.36, -0.06], [4.9, 1.08, 0.56, 0.4, -0.1],
    [6.15, 1.26, 0.5, 0.42, -0.13], [7.28, 1.38, 0.46, 0.4, -0.14], [8.45, 1.46, 0.44, 0.38, -0.14],
    [9.55, 1.5, 0.42, 0.36, -0.13], [10.6, 1.44, 0.42, 0.34, -0.12], [11.58, 1.34, 0.4, 0.32, -0.1],
    [12.85, 1.16, 0.38, 0.28, -0.06], [14.15, 0.94, 0.36, 0.22, -0.02], [15.35, 0.68, 0.32, 0.16, 0.02],
    [16.35, 0.46, 0.26, 0.12, 0.06]
  ];

  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function smooth(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
  function easeOut(t) { t = clamp01(t); return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { t = clamp01(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerp3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function mul(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function len(a) { return Math.hypot(a[0], a[1], a[2]); }
  function norm(a) { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
  function rodrigues(p, origin, axis, ang) {
    const v = sub(p, origin), c = Math.cos(ang), s = Math.sin(ang);
    return add(origin, add(add(mul(v, c), mul(cross(axis, v), s)), mul(axis, dot(axis, v) * (1 - c))));
  }
  function shotIndex(frame) {
    if (frame < 150) return 0;
    if (frame < 300) return 1;
    if (frame < 510) return 2;
    if (frame < 750) return 3;
    return 4;
  }
  const HEX = {};
  function rgbOf(hex) {
    let c = HEX[hex];
    if (!c) { const n = parseInt(hex.slice(1), 16); c = HEX[hex] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
    return c;
  }
  const FACES = [];
  function addFace(pts, mat, meta, outward) {
    const copy = pts.map((p) => p.slice());
    const n = cross(sub(copy[1], copy[0]), sub(copy[3] || copy[2], copy[0]));
    if (outward && dot(n, outward) < 0) copy.reverse();
    FACES.push(Object.assign({ pts: copy, mat }, meta || {}));
  }
  function basis(axis) {
    const ax = norm(axis);
    const tmp = Math.abs(ax[2]) < 0.85 ? [0, 0, 1] : [1, 0, 0];
    const u = norm(cross(ax, tmp));
    return { ax, u, v: cross(ax, u) };
  }
  function addBeam(a, b, half, mat, meta) {
    const { u, v } = basis(sub(b, a));
    const corners = (p) => [0, 1, 2, 3].map((i) => {
      const sx = i === 0 || i === 3 ? 1 : -1, sz = i < 2 ? 1 : -1;
      return add(p, add(mul(u, sx * half), mul(v, sz * half)));
    });
    const A = corners(a), B = corners(b), mid = mul(add(a, b), 0.5);
    for (let i = 0; i < 4; i++) {
      const i2 = (i + 1) % 4;
      const m = mul(add(add(A[i], A[i2]), add(B[i], B[i2])), 0.25);
      addFace([A[i], A[i2], B[i2], B[i]], mat, meta, sub(m, mid));
    }
  }
  function addCylinder(a, b, r, segs, mat, meta) {
    const { u, v } = basis(sub(b, a));
    const c = mul(add(a, b), 0.5);
    for (let i = 0; i < segs; i++) {
      const t0 = (i / segs) * Math.PI * 2, t1 = ((i + 1) / segs) * Math.PI * 2;
      const ring = (o, t) => add(o, add(mul(u, Math.cos(t) * r), mul(v, Math.sin(t) * r)));
      const p0 = ring(a, t0), p1 = ring(a, t1), q0 = ring(b, t0), q1 = ring(b, t1);
      addFace([p0, p1, q1, q0], mat, meta, sub(mul(add(add(p0, p1), add(q0, q1)), 0.25), c));
    }
  }
  function hingePackage(hingeA, hingeB, sample, desired) {
    const axis = norm(sub(hingeB, hingeA));
    const moved = rodrigues(sample, hingeA, axis, 0.25);
    return { hingeA, axis, sign: dot(sub(moved, sample), desired) >= 0 ? 1 : -1 };
  }
  function makeRing(st) {
    const x = st[0], hw = st[1], hu = st[2], hl = st[3], cz = st[4];
    const flat = x >= BAY.x0 - 0.02 && x <= BAY.x1 + 0.02;
    const yR = [0, hw * 0.34, hw * 0.68, hw, hw * 0.6, flat ? BAY.y : hw * 0.3, 0];
    const zR = [cz + hu, cz + hu * 0.86, cz + hu * 0.36, cz + 0.015, flat ? -0.22 : cz - hl * 0.4, flat ? BAY.z : cz - hl * 0.82, flat ? BAY.z : cz - hl];
    const right = yR.map((y, i) => [x, y, zR[i]]);
    const left = [];
    for (let i = right.length - 2; i >= 1; i--) left.push([x, -right[i][1], right[i][2]]);
    return { pts: right.concat(left), cz, x, flat };
  }
  function buildFuselage() {
    const rings = ST.map(makeRing);
    for (let s = 0; s < rings.length - 1; s++) {
      const A = rings[s], B = rings[s + 1];
      const xMid = (A.x + B.x) * 0.5, cz = (A.cz + B.cz) * 0.5;
      for (let i = 0; i < 12; i++) {
        const i2 = (i + 1) % 12;
        const quad = [A.pts[i], A.pts[i2], B.pts[i2], B.pts[i]];
        const mid = mul(quad.reduce((p, q) => add(p, q), [0, 0, 0]), 0.25);
        if ((A.flat || B.flat) && (i === 5 || i === 6)) continue;
        const canopyZone = xMid > 3.05 && xMid < 5.7;
        const upper = (i === 0 || i === 11 || i === 1 || i === 10) && xMid > 2.3 && xMid < 14.4 && !canopyZone;
        if (upper) {
          const side = i === 1 ? 1 : i === 10 ? -1 : 0;
          addFace(quad, MAT.ram, { kind: "panel", delay: Math.max(0, (xMid - 2.4) * 6.2), lift: side === 0 ? 1.05 : 0.82, slide: side * 0.28 }, sub(mid, [xMid, 0, cz]));
        } else addFace(quad, MAT.ram, { kind: "skin" }, sub(mid, [xMid, 0, cz]));
      }
    }
  }
  function buildDoors() {
    const { x0, x1, y: yH, z } = BAY, thick = 0.055;
    [-1, 1].forEach((s) => {
      const hingeY = s * yH, innerY = s * 0.02;
      const outer = [[x0, hingeY, z], [x1, hingeY, z], [x1, innerY, z], [x0, innerY, z]];
      const inner = outer.map((p) => [p[0], p[1], p[2] + thick]);
      const meta = { kind: "door", hinge: [(x0 + x1) / 2, hingeY, z], axis: [1, 0, 0], sign: s };
      addFace(outer, MAT.ram, meta, [0, 0, -1]);
      addFace(inner, MAT.ti, meta, [0, 0, 1]);
      addFace([outer[0], outer[1], inner[1], inner[0]], MAT.ti, meta, [0, s, 0]);
      addFace([outer[3], inner[3], inner[2], outer[2]], MAT.ti, meta, [0, -s, 0]);
      addFace([outer[0], inner[0], inner[3], outer[3]], MAT.ti, meta, [-1, 0, 0]);
      addFace([outer[1], outer[2], inner[2], inner[1]], MAT.ti, meta, [1, 0, 0]);
    });
  }
  function buildBay() {
    const x0 = BAY.x0 + 0.05, x1 = BAY.x1 - 0.05, y = 0.7, z0 = -0.46, z1 = 0.02;
    [[[x0, -y, z0], [x0, y, z0], [x0, y, z1], [x0, -y, z1]],
     [[x1, y, z0], [x1, -y, z0], [x1, -y, z1], [x1, y, z1]],
     [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]],
     [[x1, -y, z0], [x0, -y, z0], [x0, -y, z1], [x1, -y, z1]],
     [[x0, -y, z1], [x0, y, z1], [x1, y, z1], [x1, -y, z1]]
    ].forEach((q) => addFace(q, MAT.bay, { kind: "bay" }, [0, 0, -1]));
    [8.1, 9.5, 10.9].forEach((x) => addBeam([x, -0.62, -0.08], [x, 0.62, -0.08], 0.035, MAT.ti, { kind: "bay" }));
    [-1, 1].forEach((s) => addBeam([7.55, s * 0.36, -0.08], [10.15, s * 0.36, -1.7], 0.028, MAT.emerald, { kind: "rail" }));
  }
  function buildBulkhead(x) {
    const st = ST.reduce((best, s) => (Math.abs(s[0] - x) < Math.abs(best[0] - x) ? s : best), ST[0]);
    const ring = makeRing([x, st[1] * 0.92, st[2] * 0.9, st[3] * 0.9, st[4]]);
    const inset = (amt) => ring.pts.map((p) => {
      const c = [p[0], 0, st[4]], d = sub(p, c), L = len(d) || 1;
      return add(c, mul(d, Math.max(0.08, L - amt) / L));
    });
    const outer = inset(0.12), inner = inset(0.42);
    for (let i = 0; i < outer.length; i++) {
      const i2 = (i + 1) % outer.length;
      addFace([outer[i], outer[i2], inner[i2], inner[i]], MAT.ti, { kind: "internal" }, [-1, 0, 0]);
    }
  }
  function buildInternals() {
    [3.1, 6.4, 8.6, 12.4, 14.5].forEach(buildBulkhead);
    addBeam([2.4, 0, -0.22], [15.2, 0, -0.18], 0.055, MAT.ti, { kind: "internal" });
    addBeam([2.6, 0.22, 0.28], [14.2, 0.16, 0.22], 0.04, MAT.ti, { kind: "internal" });
    addBeam([2.6, -0.22, 0.28], [14.2, -0.16, 0.22], 0.04, MAT.ti, { kind: "internal" });
    addBeam([4.4, 0, 0.02], [6.5, 0, 0.05], 0.22, MAT.ti, { kind: "internal" });
    addBeam([8.7, 0, -0.02], [11.2, 0, -0.02], 0.2, MAT.ti, { kind: "internal" });
    const duct = [[5.35, 1.12, -0.06], [7.1, 1.0, 0.0], [9.2, 0.9, 0.03], [12.0, 0.78, 0.02], [14.0, 0.68, 0.0]];
    [-1, 1].forEach((s) => {
      for (let i = 0; i < duct.length - 1; i++) {
        addCylinder([duct[i][0], duct[i][1] * s, duct[i][2]], [duct[i + 1][0], duct[i + 1][1] * s, duct[i + 1][2]], lerp(0.2, 0.15, i / 4), 8, MAT.ti, { kind: "internal" });
      }
      addCylinder([13.9, 0.66 * s, 0], [16.15, 0.66 * s, 0], 0.3, 12, MAT.ti, { kind: "internal" });
    });
  }
  function addPlanform(spec) {
    const { rootLE, rootTE, tipLE, tipTE, thickRoot, thickTip, nu, nv } = spec;
    const pt = (u, v, surf) => {
      const p = lerp3(lerp3(rootLE, rootTE, u), lerp3(tipLE, tipTE, u), v);
      p[2] += surf * lerp(thickRoot, thickTip, v) * Math.sin(Math.PI * clamp01(u));
      return p;
    };
    for (let iv = 0; iv < nv; iv++) for (let iu = 0; iu < nu; iu++) {
      const u0 = iu / nu, u1 = (iu + 1) / nu, v0 = iv / nv, v1 = (iv + 1) / nv;
      [1, -1].forEach((surf) => {
        const info = spec.kindFor((u0 + u1) / 2, (v0 + v1) / 2, surf);
        const meta = { kind: info.kind, delay: info.delay || 0, lift: info.lift || 0, slide: info.slide || 0 };
        if (info.hinge) Object.assign(meta, info.hinge, { amp: info.amp, kind: "ctrl" });
        addFace([pt(u0, v0, surf), pt(u1, v0, surf), pt(u1, v1, surf), pt(u0, v1, surf)], info.mat || MAT.ram, meta, [0, 0, surf]);
      });
    }
  }
  function buildWings() {
    [-1, 1].forEach((s) => {
      const rootLE = [6.05, 1.22 * s, -0.02], rootTE = [13.25, 1.12 * s, -0.05];
      const tipLE = [11.0, 6.55 * s, -0.18], tipTE = [13.45, 6.35 * s, -0.22];
      const leH = hingePackage(lerp3(rootLE, rootTE, 0.16), lerp3(tipLE, tipTE, 0.16), lerp3(lerp3(rootLE, rootTE, 0.02), lerp3(tipLE, tipTE, 0.02), 0.5), [0, 0, -1]);
      const elH = hingePackage(lerp3(rootLE, rootTE, 0.8), lerp3(tipLE, tipTE, 0.8), lerp3(lerp3(rootLE, rootTE, 0.96), lerp3(tipLE, tipTE, 0.96), 0.5), [0, 0, 1]);
      addPlanform({
        rootLE, rootTE, tipLE, tipTE, thickRoot: 0.11, thickTip: 0.028, nu: 10, nv: 6,
        kindFor: (u, v, surf) => {
          if (u < 0.16) return { kind: "ctrl", hinge: leH, mat: MAT.ram, amp: (st) => st.le };
          if (u > 0.8) return { kind: "ctrl", hinge: elH, mat: MAT.ram, amp: (st) => (s === 1 ? st.elevR : st.elevL) };
          if (surf === 1) return { kind: "panel", delay: 24 + v * 46, lift: 0.62, slide: s * 0.08, mat: MAT.ram };
          return { kind: "skin", mat: MAT.ram };
        }
      });
      [0.32, 0.52, 0.68].forEach((u) => {
        const a = lerp3(lerp3(rootLE, rootTE, u), lerp3(tipLE, tipTE, u), 0.08);
        const b = lerp3(lerp3(rootLE, rootTE, u), lerp3(tipLE, tipTE, u), 0.78);
        addBeam(a, b, 0.035, MAT.ti, { kind: "internal" });
      });
    });
  }
  function buildTails() {
    [-1, 1].forEach((s) => {
      const cant = 28 * DEG, h = 2.28;
      const rootLE = [14.4, 0.52 * s, 0.38], rootTE = [17.45, 0.42 * s, 0.3];
      const tipLE = [15.65, 0.52 * s + Math.sin(cant) * h * s, 0.38 + Math.cos(cant) * h];
      const tipTE = [17.05, 0.42 * s + Math.sin(cant) * h * s, 0.3 + Math.cos(cant) * h];
      const nrm = norm(cross(sub(tipLE, rootLE), sub(rootTE, rootLE)));
      const pack = hingePackage(lerp3(rootLE, rootTE, 0.68), lerp3(tipLE, tipTE, 0.68), lerp3(lerp3(rootLE, rootTE, 0.92), lerp3(tipLE, tipTE, 0.92), 0.4), [0, s, 0]);
      const nu = 6, nv = 5;
      for (let iv = 0; iv < nv; iv++) for (let iu = 0; iu < nu; iu++) {
        const u0 = iu / nu, u1 = (iu + 1) / nu, v0 = iv / nv, v1 = (iv + 1) / nv;
        [1, -1].forEach((surf) => {
          const P = (u, v) => add(lerp3(lerp3(rootLE, rootTE, u), lerp3(tipLE, tipTE, u), v), mul(nrm, surf * 0.04 * (1 - v * 0.45)));
          const meta = (u0 + u1) / 2 > 0.68 ? { kind: "ctrl", hingeA: pack.hingeA, axis: pack.axis, sign: pack.sign, amp: (st) => (s === 1 ? st.rudR : st.rudL) } : { kind: "skin" };
          addFace([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)], MAT.ram, meta, mul(nrm, surf));
        });
      }
    });
  }
  function buildStabs() {
    [-1, 1].forEach((s) => {
      const rootLE = [14.85, 1.22 * s, 0], rootTE = [17.85, 1.08 * s, -0.03];
      const tipLE = [16.2, 3.35 * s, -0.04], tipTE = [17.55, 3.15 * s, -0.07];
      const pack = hingePackage(lerp3(rootLE, rootTE, 0.42), lerp3(tipLE, tipTE, 0.42), lerp3(lerp3(rootLE, rootTE, 0.9), lerp3(tipLE, tipTE, 0.9), 0.5), [0, 0, 1]);
      addPlanform({
        rootLE, rootTE, tipLE, tipTE, thickRoot: 0.06, thickTip: 0.02, nu: 6, nv: 4,
        kindFor: () => ({ kind: "ctrl", hinge: pack, mat: MAT.ram, amp: (st) => (s === 1 ? st.stabR : st.stabL) })
      });
    });
  }
  function buildCanopy() {
    const secs = [[3.2, 0.08, 0.1], [3.6, 0.28, 0.32], [4.15, 0.4, 0.5], [4.75, 0.36, 0.46], [5.25, 0.2, 0.24], [5.6, 0.05, 0.06]];
    const rings = secs.map((row) => Array.from({ length: 7 }, (_, i) => {
      const a = Math.PI * (i / 6);
      return [row[0], Math.cos(a) * row[1], 0.5 + Math.sin(a) * row[2]];
    }));
    for (let s = 0; s < rings.length - 1; s++) for (let i = 0; i < 6; i++) {
      const q = [rings[s][i], rings[s][i + 1], rings[s + 1][i + 1], rings[s + 1][i]];
      const mid = mul(q.reduce((p, c) => add(p, c), [0, 0, 0]), 0.25);
      addFace(q, MAT.glass, { kind: "glass" }, sub(mid, [mid[0], 0, 0.5]));
    }
  }
  function buildInlets() {
    [-1, 1].forEach((s) => {
      const y = 1.22 * s;
      addFace([[4.7, y, -0.28], [6.15, y, -0.32], [6.15, y, 0.16], [4.7, y, 0.18]], MAT.dark, { kind: "skin" }, [0, s, 0]);
      const plate = [[5.05, 1.18 * s, 0.16], [5.95, 1.18 * s, 0.16], [5.95, 1.18 * s, 0.34], [5.05, 1.18 * s, 0.34]];
      const pack = hingePackage(plate[0], plate[1], [5.5, 1.18 * s, 0.34], [0, s, 1]);
      addFace(plate, MAT.ceramic, { kind: "ctrl", hingeA: pack.hingeA, axis: pack.axis, sign: pack.sign, amp: (st) => st.bypass }, [0, s, 0]);
    });
  }
  function buildNozzles() {
    [-1, 1].forEach((s) => {
      const y = 0.66 * s, x0 = 16.2, xh = 17.22, x1 = 18.32, hw = 0.38, hh = 0.2;
      addFace([[x0, y - hw, -hh], [xh, y - hw, -hh], [xh, y - hw, hh], [x0, y - hw, hh]], MAT.ceramic, { kind: "skin" }, [0, -1, 0]);
      addFace([[xh, y + hw, -hh], [x0, y + hw, -hh], [x0, y + hw, hh], [xh, y + hw, hh]], MAT.ceramic, { kind: "skin" }, [0, 1, 0]);
      addFace([[x0, y - hw, hh], [x0, y + hw, hh], [xh, y + hw, hh], [xh, y - hw, hh]], MAT.ceramic, { kind: "skin" }, [0, 0, 1]);
      addFace([[x0, y + hw, -hh], [x0, y - hw, -hh], [xh, y - hw, -hh], [xh, y + hw, -hh]], MAT.ceramic, { kind: "skin" }, [0, 0, -1]);
      const up = hingePackage([xh, y - hw, hh], [xh, y + hw, hh], [x1, y, hh], [0, 0, -1]);
      const lo = hingePackage([xh, y - hw, -hh], [xh, y + hw, -hh], [x1, y, -hh], [0, 0, -1]);
      const meta = (pack) => ({ kind: "ctrl", hingeA: pack.hingeA, axis: pack.axis, sign: pack.sign, amp: (st) => st.pitch });
      addFace([[xh, y - hw, hh], [xh, y + hw, hh], [x1, y + hw, hh], [x1, y - hw, hh]], MAT.ceramic, meta(up), [0, 0, 1]);
      addFace([[xh, y + hw, -hh], [xh, y - hw, -hh], [x1, y - hw, -hh], [x1, y + hw, -hh]], MAT.ceramic, meta(lo), [0, 0, -1]);
    });
  }
  function buildMissile() {
    const nose = MSL.x - MSL.half, tail = MSL.x + MSL.half, z = MSL.z, r = MSL.r, meta = { kind: "missile" };
    addCylinder([nose + 0.48, 0, z], [tail - 0.35, 0, z], r, 12, MAT.missile, meta);
    addCylinder([tail - 0.55, 0, z], [tail - 0.35, 0, z], r * 1.08, 12, MAT.band, meta);
    const { u, v } = basis([1, 0, 0]);
    for (let i = 0; i < 8; i++) {
      const t0 = (i / 8) * Math.PI * 2, t1 = ((i + 1) / 8) * Math.PI * 2;
      const b0 = add([nose + 0.48, 0, z], add(mul(u, Math.cos(t0) * r), mul(v, Math.sin(t0) * r)));
      const b1 = add([nose + 0.48, 0, z], add(mul(u, Math.cos(t1) * r), mul(v, Math.sin(t1) * r)));
      addFace([[nose, 0, z], b1, b0, b0], MAT.missile, meta, sub(mul(add(b0, b1), 0.5), [nose + 0.2, 0, z]));
    }
    const fin = (atX, roll) => {
      const c = Math.cos(roll), s = Math.sin(roll), dir = [0, c, s], span = 0.34, chord = 0.42;
      const p1 = add([atX, 0, z], mul(dir, r));
      const p2 = add([atX + chord, 0, z], mul(dir, r));
      const p3 = add([atX + chord * 0.82, 0, z], mul(dir, r + span));
      const p4 = add([atX + chord * 0.15, 0, z], mul(dir, r + span));
      addFace([p1, p2, p3, p4], MAT.missile, meta, dir);
      addFace([p4, p3, p2, p1], MAT.missile, meta, mul(dir, -1));
    };
    for (let k = 0; k < 4; k++) { fin(tail - 0.72, k * Math.PI / 2); fin(MSL.x - 0.15, k * Math.PI / 2 + 0.18); }
  }
  buildFuselage(); buildDoors(); buildBay(); buildInternals(); buildWings(); buildTails(); buildStabs(); buildCanopy(); buildInlets(); buildNozzles(); buildMissile();
  addBeam([16.2, 0, 0.18], [17.55, 0, 0.28], 0.12, MAT.ram, { kind: "skin" });

  function computeState(frame) {
    const skin = easeOut(clamp01((frame - 6) / 118));
    const close = easeInOut(clamp01((frame - 770) / 130));
    const doorT = easeInOut(clamp01((frame - 151) / 24));
    return {
      frame, skin, panel: skin * (1 - close), doorT, door: doorT * 104 * DEG,
      trap: easeInOut(clamp01((frame - 334) / 148)),
      pitch: easeInOut(clamp01((frame - 536) / 150)) * 20 * DEG,
      combat: easeInOut(clamp01((frame - 792) / 150)),
      ab: clamp01((frame - 520) / 36),
      le: easeInOut(clamp01((frame - 792) / 150)) * 12 * DEG,
      elevL: easeInOut(clamp01((frame - 792) / 150)) * 8 * DEG,
      elevR: easeInOut(clamp01((frame - 792) / 150)) * -4.5 * DEG,
      rudL: easeInOut(clamp01((frame - 792) / 150)) * 5 * DEG,
      rudR: easeInOut(clamp01((frame - 792) / 150)) * -2 * DEG,
      stabL: easeInOut(clamp01((frame - 792) / 150)) * 7 * DEG,
      stabR: easeInOut(clamp01((frame - 792) / 150)) * 5 * DEG,
      bypass: easeInOut(clamp01((frame - 792) / 150)) * 24 * DEG,
      plume: clamp01((frame - 511) / 28)
    };
  }
  function missileShift(trap) { return [lerp(0, 0.42, trap), 0, lerp(0, -1.62, trap)]; }
  function cameraOf(frame) {
    let i = 0;
    if (frame >= KEYS[KEYS.length - 1].f) i = KEYS.length - 2;
    else while (KEYS[i + 1] && KEYS[i + 1].f < frame) i++;
    const a = KEYS[i], b = KEYS[Math.min(i + 1, KEYS.length - 1)];
    const raw = b.f === a.f ? 0 : (frame - a.f) / (b.f - a.f);
    const t = lerp(raw, smooth(raw), 0.55);
    let eye = lerp3(a.eye, b.eye, t), target = lerp3(a.target, b.target, t), fov = lerp(a.fov, b.fov, t);
    if (frame >= 500 && frame <= 780) {
      const u = clamp01((frame - 510) / 240);
      const ang = lerp(-2.35, -0.42, easeInOut(u));
      const focus = [17.55, 0, 0.02];
      const orbitEye = [focus[0] + Math.cos(ang) * 8.4, focus[1] + Math.sin(ang) * 8.4, focus[2] + lerp(1.6, 2.8, easeInOut(u))];
      let w = 1;
      if (frame < 545) w = smooth((frame - 500) / 45);
      else if (frame > 735) w = 1 - smooth((frame - 735) / 45);
      eye = lerp3(eye, orbitEye, w); target = lerp3(target, focus, w); fov = lerp(fov, 23, w);
    }
    return { eye, target, fov };
  }
  function camBasis(eye, target) {
    const z = norm(sub(eye, target));
    const x = norm(cross([0, 0, 1], z));
    return { eye, x, y: cross(z, x), z };
  }
  function toCam(p, cam) { const d = sub(p, cam.eye); return [dot(d, cam.x), dot(d, cam.y), dot(d, cam.z)]; }
  function clipNear(pts, near) {
    const inside = (p) => -p[2] > near, out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], ai = inside(a), bi = inside(b);
      const hit = () => lerp3(a, b, clamp01(((-a[2]) - near) / ((-a[2]) - (-b[2]) || 1e-6)));
      if (ai && bi) out.push(b);
      else if (ai && !bi) out.push(hit());
      else if (!ai && bi) { out.push(hit()); out.push(b); }
    }
    return out;
  }
  function projectCam(c, fov, bias) {
    const depth = -c[2];
    if (depth < 0.05) return null;
    const f = 1 / Math.tan((fov * Math.PI) / 360), aspect = W / H;
    const sx = (c[0] / depth) * (f / aspect), sy = (c[1] / depth) * f;
    return { x: (sx * 0.5 + 0.5) * W + bias, y: (1 - (sy * 0.5 + 0.5)) * H, depth };
  }
  function shade(mat, ndotl, hemi, rimAmt, ndotf) {
    const base = rgbOf(mat.hex);
    let L = 0.22 + 0.9 * Math.pow(Math.max(0, ndotl), 0.82) + Math.max(0, hemi) * 0.26 + 0.62 * Math.max(0, ndotf || 0);
    L = Math.min(1.35, Math.max(0.1, L));
    let r = base[0] * L, g = base[1] * L, b = base[2] * L;
    const up = clamp01(hemi);
    r += (58 - r) * up * 0.18; g += (66 - g) * up * 0.18; b += (74 - b) * up * 0.18;
    if (mat.emissive) { const e = mat.emissive; r = r * (1 - e) + base[0] * e; g = g * (1 - e) + base[1] * e; b = b * (1 - e) + base[2] * e; }
    if (mat.rim && rimAmt > 0) { const k = rimAmt * (mat.rimStr || 0.3); r = r * (1 - k) + mat.rim[0] * k; g = g * (1 - k) + mat.rim[1] * k; b = b * (1 - k) + mat.rim[2] * k; }
    return [r | 0, g | 0, b | 0];
  }
  function transformFace(face, state) {
    let pts = face.pts.map((p) => p.slice());
    if (face.kind === "panel") {
      const t = Math.min(easeOut(clamp01((state.frame - 8 - face.delay) / 72)), state.panel);
      pts = pts.map((p) => add(p, [0, (face.slide || 0) * t, (face.lift || 0) * t]));
    } else if (face.kind === "door") pts = pts.map((p) => rodrigues(p, face.hinge, face.axis, face.sign * state.door));
    else if (face.kind === "ctrl") {
      const ang = face.sign * face.amp(state);
      if (Math.abs(ang) > 1e-5) pts = pts.map((p) => rodrigues(p, face.hingeA, face.axis, ang));
    } else if (face.kind === "missile") {
      const sh = missileShift(state.trap);
      pts = pts.map((p) => add(p, sh));
    }
    return pts;
  }
  function faceVisible(face, state) {
    if (face.kind === "internal" && state.panel < 0.16) return false;
    if ((face.kind === "bay" || face.kind === "rail" || face.kind === "missile") && state.doorT < 0.04 && state.skin < 0.35) return false;
    return true;
  }
  function addDynCyl(list, a, b, r, mat) {
    const { u, v } = basis(sub(b, a));
    for (let i = 0; i < 8; i++) {
      const t0 = (i / 8) * Math.PI * 2, t1 = ((i + 1) / 8) * Math.PI * 2;
      const ring = (o, t) => add(o, add(mul(u, Math.cos(t) * r), mul(v, Math.sin(t) * r)));
      list.push({ pts: [ring(a, t0), ring(a, t1), ring(b, t1), ring(b, t0)], mat });
    }
  }
  function actuators(state) {
    if (state.doorT < 0.02) return [];
    const out = [];
    [-1, 1].forEach((s) => [8.15, 10.55].forEach((x) => {
      const fixed = [x, s * 0.48, -0.02];
      const moving = rodrigues([x, s * 0.4, BAY.z + 0.04], [x, s * BAY.y, BAY.z], [1, 0, 0], s * state.door);
      addDynCyl(out, fixed, lerp3(fixed, moving, 0.58), 0.05, MAT.gold);
      addDynCyl(out, lerp3(fixed, moving, 0.4), moving, 0.026, MAT.gold);
    }));
    return out;
  }
  function trapeze(state) {
    if (state.doorT < 0.2) return [];
    const sh = missileShift(state.trap), out = [];
    const attach = [-1, 1].map((s) => add([8.85, s * 0.2, MSL.z + 0.16], sh));
    [-1, 1].forEach((s, idx) => addDynCyl(out, [8.15, s * 0.2, 0.02], attach[idx], 0.045, MAT.gold));
    addDynCyl(out, attach[0], attach[1], 0.04, MAT.gold);
    return out;
  }
  function plumeMeshes(state) {
    if (state.plume <= 0.01) return [];
    const soft = [], dir = [Math.cos(state.pitch), 0, -Math.sin(state.pitch)];
    [-1, 1].forEach((s) => {
      const exit = add([17.22, 0.66 * s, 0], mul(dir, 1.12));
      const end = add(exit, mul(dir, lerp(2.4, 4.2, state.ab)));
      const { u, v } = basis(dir);
      for (let i = 0; i < 8; i++) {
        const t0 = (i / 8) * Math.PI * 2, t1 = ((i + 1) / 8) * Math.PI * 2;
        for (let k = 0; k < 8; k++) {
          const a0 = k / 8, a1 = (k + 1) / 8;
          const ring = (center, rad, t) => add(center, add(mul(u, Math.cos(t) * rad), mul(v, Math.sin(t) * rad)));
          const c0 = lerp3(exit, end, a0), c1 = lerp3(exit, end, a1);
          soft.push({ pts: [ring(c0, lerp(0.16, 0.62, a0), t0), ring(c0, lerp(0.16, 0.62, a0), t1), ring(c1, lerp(0.16, 0.62, a1), t1), ring(c1, lerp(0.16, 0.62, a1), t0)], mat: MAT.blue, alpha: 0.28 * state.plume * (1 - a0 * 0.45), force: true, noEdge: true });
        }
      }
    });
    return soft;
  }
  function paintList(ctx, list, cam, fov, bias, keyL, fillL) {
    const draw = [];
    for (const item of list) {
      const clipped = clipNear(item.pts.map((p) => toCam(p, cam)), 0.12);
      if (clipped.length < 3) continue;
      const n = norm(cross(sub(item.pts[1], item.pts[0]), sub(item.pts[3] || item.pts[2], item.pts[0])));
      const centroid = mul(item.pts.reduce((p, q) => add(p, q), [0, 0, 0]), 1 / item.pts.length);
      const view = norm(sub(cam.eye, centroid));
      if (!item.mat.alpha && !item.force && dot(n, view) <= 0.02) continue;
      const proj = [];
      let depth = 0, ok = true;
      for (const c of clipped) { const pr = projectCam(c, fov, bias); if (!pr) { ok = false; break; } proj.push(pr); depth += pr.depth; }
      if (!ok) continue;
      const col = shade(item.mat, dot(n, keyL), n[2], Math.pow(1 - Math.abs(dot(n, view)), 1.7), fillL ? dot(n, fillL) : 0);
      draw.push({ proj, depth: depth / proj.length, col, edge: item.noEdge ? null : item.mat.edge, alpha: item.alpha != null ? item.alpha : item.mat.alpha || 1 });
    }
    draw.sort((a, b) => b.depth - a.depth);
    for (const d of draw) {
      ctx.beginPath(); ctx.moveTo(d.proj[0].x, d.proj[0].y);
      for (let i = 1; i < d.proj.length; i++) ctx.lineTo(d.proj[i].x, d.proj[i].y);
      ctx.closePath(); ctx.globalAlpha = d.alpha; ctx.fillStyle = "rgb(" + d.col.join(",") + ")"; ctx.fill();
      if (d.edge) { ctx.strokeStyle = d.edge; ctx.lineWidth = 1.15; ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  function plumePoint(state, s, along) {
    const dir = [Math.cos(state.pitch), 0, -Math.sin(state.pitch)];
    return add(add([17.22, 0.66 * s, 0], mul(dir, 1.15)), mul(dir, along));
  }
  function drawDiamonds(ctx, state, cam, fov, bias) {
    if (state.plume < 0.04) return;
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    [-1, 1].forEach((s) => {
      for (let d = 0; d < 5; d++) {
        const pr = projectCam(toCam(plumePoint(state, s, 0.32 + d * 0.5), cam), fov, bias);
        if (!pr) continue;
        const pulse = 0.7 + 0.3 * Math.sin(state.frame * 0.4 + d * 1.15);
        const ssz = (14 + d * 8) * pulse * state.plume * (0.45 + state.ab * 0.7);
        ctx.fillStyle = "#00B4D8"; ctx.globalAlpha = 0.9 * pulse * state.plume;
        ctx.beginPath(); ctx.moveTo(pr.x, pr.y - ssz); ctx.lineTo(pr.x + ssz * 0.42, pr.y); ctx.lineTo(pr.x, pr.y + ssz); ctx.lineTo(pr.x - ssz * 0.42, pr.y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#F4FEFF"; ctx.globalAlpha = 0.8 * state.plume;
        ctx.beginPath(); ctx.arc(pr.x, pr.y, Math.max(2, ssz * 0.16), 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.restore();
  }
  function kineticText(ctx, text, x, y, local, font, color, tracking, stagger) {
    ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = "alphabetic";
    let cx = x;
    for (let i = 0; i < text.length; i++) {
      const appear = easeOut(clamp01((local - i * stagger) / 8));
      ctx.globalAlpha = appear; ctx.fillText(text[i], cx, y + (1 - appear) * 14);
      cx += ctx.measureText(text[i]).width + tracking;
    }
    ctx.globalAlpha = 1;
  }
  function drawHUD(ctx, state, cam, fov, bias) {
    const frame = state.frame, si = shotIndex(frame), shot = SHOTS[si];
    const local = frame - [0, 150, 300, 510, 750][si];
    ctx.strokeStyle = "#2A9D8F"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.85;
    [[26, 26, 1, 1], [W - 26, 26, -1, 1], [26, H - 26, 1, -1], [W - 26, H - 26, -1, -1]].forEach((c) => {
      ctx.beginPath(); ctx.moveTo(c[0], c[1] + c[3] * 36); ctx.lineTo(c[0], c[1]); ctx.lineTo(c[0] + c[2] * 36, c[1]); ctx.stroke();
    });
    ctx.globalAlpha = 1; ctx.textAlign = "left"; ctx.font = "500 15px 'JetBrains Mono'"; ctx.fillStyle = "#9AA3AD";
    ctx.fillText("GEN-V ANATOMY JIG", 64, 52);
    ctx.font = "400 12px 'JetBrains Mono'"; ctx.fillStyle = "#6E7781";
    ctx.fillText("SCHEMATIC  ·  NOT AN ENGINEERING DRAWING", 64, 72);
    const f = frame % 30, sec = Math.floor(frame / 30);
    const tc = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0") + ":" + String(f).padStart(2, "0");
    ctx.textAlign = "right"; ctx.font = "500 18px 'JetBrains Mono'"; ctx.fillStyle = "#E7E4DC"; ctx.fillText(tc, W - 64, 52);
    ctx.font = "400 12px 'JetBrains Mono'"; ctx.fillStyle = "#6E7781"; ctx.fillText("F " + String(frame).padStart(4, "0") + "  /  1020", W - 64, 72);
    ctx.textAlign = "left"; ctx.font = "700 200px Inter"; ctx.fillStyle = shot.color; ctx.globalAlpha = 0.065;
    ctx.fillText(shot.id, 56, 292 - local * 0.12); ctx.globalAlpha = 1;
    kineticText(ctx, shot.title, 68, 168, local, "600 54px Inter", "#E7E4DC", 1.5, 0.55);
    kineticText(ctx, shot.sub, 68, 198, local - 6, "400 15px 'JetBrains Mono'", shot.color, 0.6, 0.25);
    let x0 = 64; [150, 150, 210, 240, 270].forEach((n, i) => {
      const w = (n / 1020) * 420; ctx.fillStyle = i === si ? SHOTS[i].color : "rgba(255,255,255,0.1)";
      ctx.globalAlpha = i === si ? 0.95 : 0.45; ctx.fillRect(x0, H - 36, w - 4, 4); x0 += w;
    });
    ctx.globalAlpha = 1;
    const reads = [
      ["BAY", state.doorT > 0.97 ? "OPEN" : state.doorT > 0.04 ? "DRIVE" : "CLOSED"],
      ["HYD", "4000 PSI"],
      ["TRAPEZE", String(Math.round(state.trap * 100)).padStart(3, "0") + " PCT"],
      ["VECTOR", (state.pitch / DEG).toFixed(1) + " DEG"],
      ["SURF", String(Math.round(state.combat * 100)).padStart(3, "0") + " PCT"]
    ];
    ctx.font = "500 13px 'JetBrains Mono'";
    reads.forEach((pair, idx) => {
      const rx = 520 + idx * 150; ctx.fillStyle = "#6E7781"; ctx.fillText(pair[0], rx, H - 48);
      ctx.fillStyle = idx === 3 ? "#00B4D8" : idx === 1 ? "#F77F00" : "#E7E4DC"; ctx.fillText(pair[1], rx, H - 28);
    });
    [["#121316", "RAM"], ["#2F323A", "TI"], ["#F77F00", "HYD"], ["#2A9D8F", "RAIL"], ["#00B4D8", "AB"]].forEach((s, i) => {
      const sx = W - 64 - (5 - i) * 78; ctx.fillStyle = s[0]; ctx.fillRect(sx, H - 52, 14, 14);
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.strokeRect(sx, H - 52, 14, 14);
      ctx.fillStyle = "#9AA3AD"; ctx.font = "400 11px 'JetBrains Mono'"; ctx.fillText(s[1], sx + 20, H - 40);
    });
    const sh = missileShift(state.trap);
    const doorAnchor = rodrigues([(BAY.x0 + BAY.x1) / 2, 0.36, BAY.z], [(BAY.x0 + BAY.x1) / 2, BAY.y, BAY.z], [1, 0, 0], state.door);
    const sets = [
      [{ p: [8.4, 0.2, 0.55 + state.panel * 0.9], k: "PANEL", t: "RAM SKIN", c: "#E7E4DC" }, { p: [11.2, 0.16, 0.24], k: "STRUCTURE", t: "TITANIUM LONGERON", c: "#C5CAD1" }, { p: [8.2, 1.05, 0.02], k: "FLOW", t: "INTAKE TRUNK", c: "#C5CAD1" }],
      [{ p: doorAnchor, k: "DOOR", t: "BELLY BAY", c: "#E7E4DC" }, { p: rodrigues([9.3, 0.42, -0.15], [9.3, BAY.y, BAY.z], [1, 0, 0], state.door), k: "ACTUATOR", t: "4000 PSI", c: "#F77F00" }],
      [{ p: add([9.4, 0, MSL.z], sh), k: "STORE", t: "AIM-120 CLASS", c: "#E7E4DC" }, { p: add([8.5, 0.2, MSL.z + 0.2], sh), k: "ARM", t: "TRAPEZE", c: "#F77F00" }, { p: [9.0, 0.36, -0.9], k: "GUIDE", t: "EMERALD RAIL", c: "#2A9D8F" }],
      [{ p: [17.9, 0.95, 0.05], k: "NOZZLE", t: "DIVERGENT FLAP", c: "#E7E4DC" }, { p: plumePoint(state, 1, 1.3), k: "PLUME", t: "SHOCK DIAMOND", c: "#00B4D8" }],
      [{ p: [12.6, 4.4, 0.15], k: "WING", t: "ELEVON", c: "#E7E4DC" }, { p: [17.35, 0.66, 0.22], k: "VECTOR", t: "PITCH 20 DEG", c: "#00B4D8" }, { p: [5.5, 1.35, 0.4], k: "INLET", t: "BYPASS DOOR", c: "#F77F00" }]
    ];
    sets[si].forEach((item, idx) => {
      const appear = easeOut(clamp01((local - 14 - idx * 7) / 10));
      if (appear <= 0) return;
      const pr = projectCam(toCam(item.p, cam), fov, bias);
      if (!pr) return;
      const dockX = Math.min(W - 280, Math.max(pr.x + 80, 1180)), dockY = 250 + idx * 78;
      ctx.save(); ctx.globalAlpha = appear; ctx.strokeStyle = item.c; ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.moveTo(pr.x, pr.y); ctx.lineTo(dockX - 12, dockY - 4); ctx.lineTo(dockX, dockY - 4); ctx.stroke();
      ctx.fillStyle = item.c; ctx.beginPath(); ctx.arc(pr.x, pr.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = "left"; ctx.font = "400 11px 'JetBrains Mono'"; ctx.fillText(item.k, dockX, dockY - 12);
      ctx.font = "600 16px Inter"; ctx.fillStyle = "#E7E4DC"; ctx.fillText(item.t, dockX, dockY + 10); ctx.restore();
    });
  }
  function renderFrame(frame, canvas) {
    frame = Math.max(0, Math.min(1019, frame | 0));
    const ctx = canvas.getContext("2d", { alpha: false });
    const state = computeState(frame);
    const pose = cameraOf(frame);
    const cam = camBasis(pose.eye, pose.target);
    const bias = [210, 40, 20, 30, 70][shotIndex(frame)];
    const keyL = norm([-0.42, -0.72, 0.62]), fillL = norm([0.15, 0.05, -1]);
    const g = ctx.createRadialGradient(W * 0.62, H * 0.42, 40, W * 0.5, H * 0.5, W * 0.72);
    g.addColorStop(0, "#14171c"); g.addColorStop(0.55, "#0c0e12"); g.addColorStop(1, "#05060a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    if (cam.eye[2] > 1.1 && frame < 930) {
      ctx.save(); ctx.globalAlpha = 0.22 * (1 - clamp01((frame - 830) / 100)); ctx.strokeStyle = "#163833";
      for (let x = -2; x <= 20; x++) {
        const pa = projectCam(toCam([x, -8, -2.7], cam), pose.fov, bias), pb = projectCam(toCam([x, 8, -2.7], cam), pose.fov, bias);
        if (pa && pb) { ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke(); }
      }
      ctx.restore();
    }
    const opaque = [], glass = [];
    for (const face of FACES) {
      if (!faceVisible(face, state)) continue;
      const item = { pts: transformFace(face, state), mat: face.mat, force: face.kind === "glass" };
      (face.kind === "glass" ? glass : opaque).push(item);
    }
    actuators(state).forEach((f) => opaque.push(f));
    trapeze(state).forEach((f) => opaque.push(f));
    paintList(ctx, opaque, cam, pose.fov, bias, keyL, fillL);
    paintList(ctx, glass, cam, pose.fov, bias, keyL, fillL);
    const plume = plumeMeshes(state);
    if (plume.length) { ctx.save(); ctx.globalCompositeOperation = "lighter"; paintList(ctx, plume, cam, pose.fov, bias, keyL, fillL); ctx.restore(); }
    drawDiamonds(ctx, state, cam, pose.fov, bias);
    const v = ctx.createRadialGradient(W * 0.55, H * 0.48, H * 0.22, W * 0.5, H * 0.5, H * 0.78);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.58)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    if (frame > 770) {
      const k = clamp01((frame - 770) / 70); ctx.save();
      for (let i = 0; i < 16; i++) {
        ctx.globalAlpha = 0.045 * k; ctx.fillStyle = i % 3 === 0 ? "#00B4D8" : "#9aa3ad";
        ctx.fillRect(((frame * 14 + i * 180) % (W + 360)) - 180, (i * 67 + 30) % H, 70 + ((i * 53) % 220), 1);
      }
      ctx.restore();
    }
    drawHUD(ctx, state, cam, pose.fov, bias);
  }
  window.Jig = { renderFrame, FPS: 30, FRAMES: 1020, SHOTS };
})();
