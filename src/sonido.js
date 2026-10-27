/* Sonido: todo se sintetiza con Web Audio, sin archivos (funciona sin internet).
   No toca la pantalla: la interfaz llama a Sonido.efecto('nombre').
   Cada estación dice qué sonido usa (campo `sonido` en src/datos/estaciones.js). Recetas basadas en las de Planta Reci. */

export function crearSonido() {
  let ctx = null, salida = null, ruidoBuf = null, activo = true;

  function iniciar() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        salida = ctx.createGain();
        salida.gain.value = 0.8;
        // limitador: solo actúa en los picos, para que nada sature los parlantes chicos
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -10; comp.knee.value = 4; comp.ratio.value = 12; comp.attack.value = 0.002;
        salida.connect(comp); comp.connect(ctx.destination);
        ruidoBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
        const d = ruidoBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    } catch (e) { return false; }
  }

  // Un tono con barrido de frecuencia (f -> f2) y envolvente corta.
  function tono(o) {
    const t = ctx.currentTime + (o.t || 0);
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.tipo || 'triangle';
    osc.frequency.setValueAtTime(o.f, t);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.1, t + (o.ataque || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    osc.connect(g); g.connect(salida);
    osc.start(t); osc.stop(t + o.d + 0.02);
  }

  // Ruido filtrado: serrucho, lija, aerosol, golpes.
  function ruido(o) {
    const t = ctx.currentTime + (o.t || 0);
    const src = ctx.createBufferSource(); src.buffer = ruidoBuf;
    const f = ctx.createBiquadFilter();
    f.type = o.filtro || 'lowpass';
    f.frequency.setValueAtTime(o.f || 1200, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    f.Q.value = o.q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(o.vol || 0.1, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    src.connect(f); f.connect(g); g.connect(salida);
    src.start(t, Math.random() * 0.5); src.stop(t + o.d + 0.02);
  }

  const notas = (lista, paso, o) => lista.forEach((f, i) => f && tono(Object.assign({ f, d: paso * 1.6, t: i * paso }, o)));

  const EFECTOS = {
    // interfaz (suaves)
    clic: () => tono({ f: 900, d: 0.04, tipo: 'square', vol: 0.03 }),
    elegir: () => tono({ f: 660, f2: 880, d: 0.07, tipo: 'square', vol: 0.03 }),
    poner: () => { tono({ f: 520, f2: 780, d: 0.08, tipo: 'square', vol: 0.04 }); ruido({ f: 600, d: 0.05, vol: 0.08, t: 0.05 }); },
    sacar: () => tono({ f: 600, f2: 300, d: 0.1, tipo: 'square', vol: 0.04 }),
    producir: () => notas([392, 523, 659], 0.07, { tipo: 'square', vol: 0.04 }),
    cinta: () => { ruido({ f: 300, d: 0.12, vol: 0.06 }); },
    // estaciones
    sierra: () => { for (let i = 0; i < 4; i++) ruido({ filtro: 'bandpass', f: 2500, d: 0.09, vol: 0.18, t: i * 0.11, q: 3 }); },
    lija: () => { for (let i = 0; i < 3; i++) ruido({ filtro: 'highpass', f: 3000, d: 0.12, vol: 0.12, t: i * 0.14 }); },
    pintar: () => ruido({ filtro: 'highpass', f: 5000, d: 0.45, vol: 0.12 }),
    taladro: () => { tono({ f: 180, f2: 260, d: 0.45, tipo: 'sawtooth', vol: 0.05 }); ruido({ filtro: 'bandpass', f: 1500, d: 0.4, vol: 0.06, q: 4 }); },
    martillo: () => { for (let i = 0; i < 3; i++) { tono({ f: 300, f2: 120, d: 0.08, tipo: 'sine', vol: 0.3, t: i * 0.15 }); ruido({ f: 2500, d: 0.04, vol: 0.12, t: i * 0.15 }); } },
    cola: () => { tono({ f: 300, f2: 180, d: 0.18, tipo: 'sine', vol: 0.15 }); tono({ f: 260, f2: 160, d: 0.18, tipo: 'sine', vol: 0.12, t: 0.2 }); },
    soldar: () => { for (let i = 0; i < 8; i++) ruido({ filtro: 'highpass', f: 4000, d: 0.03, vol: 0.15, t: i * 0.05 + Math.random() * 0.03 }); tono({ f: 120, d: 0.4, tipo: 'sawtooth', vol: 0.03 }); },
    sensor: () => { tono({ f: 1320, d: 0.08, tipo: 'sine', vol: 0.1 }); tono({ f: 1760, d: 0.1, tipo: 'sine', vol: 0.1, t: 0.1 }); },
    horno: () => ruido({ f: 300, f2: 900, d: 0.5, vol: 0.18 }),
    molde: () => { tono({ f: 140, f2: 70, d: 0.2, tipo: 'sine', vol: 0.35 }); ruido({ f: 800, d: 0.08, vol: 0.12 }); },
    frio: () => { notas([1568, 2093, 1760], 0.06, { tipo: 'sine', vol: 0.06 }); ruido({ filtro: 'highpass', f: 6000, d: 0.3, vol: 0.05 }); },
    desmoldar: () => tono({ f: 400, f2: 900, d: 0.15, tipo: 'sine', vol: 0.15 }),
    llenar: () => { for (let i = 0; i < 4; i++) tono({ f: 300 + i * 60, f2: 500 + i * 60, d: 0.08, tipo: 'sine', vol: 0.15, t: i * 0.1 }); },
    tapar: () => { ruido({ filtro: 'bandpass', f: 3000, d: 0.04, vol: 0.2, q: 5 }); ruido({ filtro: 'bandpass', f: 3500, d: 0.04, vol: 0.2, t: 0.08, q: 5 }); },
    etiqueta: () => { ruido({ filtro: 'highpass', f: 2000, d: 0.15, vol: 0.08 }); tono({ f: 800, d: 0.05, tipo: 'square', vol: 0.03, t: 0.15 }); },
    pesa: () => { tono({ f: 90, f2: 60, d: 0.35, tipo: 'sine', vol: 0.4 }); ruido({ f: 400, d: 0.2, vol: 0.12 }); },
    // resultados
    tilde: () => tono({ f: 1047, d: 0.12, tipo: 'triangle', vol: 0.1 }),
    falta: () => tono({ f: 330, d: 0.15, tipo: 'triangle', vol: 0.08 }),
    pieza: () => tono({ f: 1568, d: 0.04, tipo: 'sine', vol: 0.05 }),
    reciclar: () => { tono({ f: 700, f2: 250, d: 0.25, tipo: 'triangle', vol: 0.08 }); ruido({ f: 600, d: 0.08, vol: 0.12, t: 0.22 }); },
    falla: () => { tono({ f: 196, d: 0.18, tipo: 'square', vol: 0.06 }); tono({ f: 147, d: 0.35, tipo: 'square', vol: 0.06, t: 0.2 }); },
    peor: () => { tono({ f: 523, f2: 440, d: 0.2, tipo: 'triangle', vol: 0.08 }); tono({ f: 440, f2: 392, d: 0.25, tipo: 'triangle', vol: 0.08, t: 0.2 }); },
    estrella: n => tono({ f: [784, 988, 1175][Math.max(0, Math.min(2, (n || 1) - 1))], d: 0.3, tipo: 'triangle', vol: 0.12 }),
    gana: () => { notas([523, 659, 784, 1047], 0.11, { tipo: 'square', vol: 0.06 }); tono({ f: 1047, d: 0.5, tipo: 'triangle', vol: 0.1, t: 0.44 }); tono({ f: 1319, d: 0.5, tipo: 'triangle', vol: 0.07, t: 0.44 }); }
  };

  return {
    efecto(nombre, dato) {
      if (!activo || !EFECTOS[nombre] || !iniciar()) return;
      try { EFECTOS[nombre](dato); } catch (e) { /* sin sonido */ }
    },
    activar: () => iniciar(),
    config(o) { if (o.efectos !== undefined) activo = !!o.efectos; },
    hay: nombre => !!EFECTOS[nombre]
  };
}

export const Sonido = crearSonido();
