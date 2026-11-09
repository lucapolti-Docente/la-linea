/* Sonido: todo se sintetiza con Web Audio, sin archivos (anda sin internet y desde el pendrive).
   No toca la pantalla: la interfaz llama a Sonido.efecto('nombre').
   Basado en el de Planta Reci, con efectos propios de la línea. */

const VOLUMEN = 0.5;
const CLAVE = 'laLinea.sonido'; // aparte de laLinea.v1, que no cambia de forma

export function crearSonido() {
  let ctx = null, salida = null, ruidoBuf = null;
  let activo = true;
  try { activo = localStorage.getItem(CLAVE) !== 'no'; } catch (e) { /* sin guardado */ }

  function iniciar() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        ctx = new AC();
        salida = ctx.createGain();
        salida.gain.value = VOLUMEN;
        // limitador: solo actúa en los picos, para que nada sature los parlantes
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
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.ataque || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    osc.connect(g); g.connect(salida);
    osc.start(t); osc.stop(t + o.d + 0.02);
  }

  // Ruido filtrado: golpes de máquina, cinta.
  function ruido(o) {
    const t = ctx.currentTime + (o.t || 0);
    const src = ctx.createBufferSource(); src.buffer = ruidoBuf;
    const f = ctx.createBiquadFilter();
    f.type = o.filtro || 'lowpass';
    f.frequency.setValueAtTime(o.f || 1200, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    f.Q.value = o.q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(o.vol || 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.d);
    src.connect(f); f.connect(g); g.connect(salida);
    src.start(t, Math.random() * 0.5); src.stop(t + o.d + 0.02);
  }

  const notas = (lista, paso, o) => lista.forEach((f, i) => tono(Object.assign({ f, d: paso * 1.6, t: i * paso }, o)));
  const ESCALA = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];

  const EFECTOS = {
    // armar la línea
    cinta: () => ruido({ f: 1400, d: 0.04, vol: 0.12 }),
    poner: () => { ruido({ f: 700, d: 0.06, vol: 0.2 }); tono({ f: 420, f2: 620, d: 0.08, tipo: 'square', vol: 0.05 }); },
    sacar: () => tono({ f: 600, f2: 300, d: 0.1, tipo: 'square', vol: 0.05 }),
    clic: () => tono({ f: 900, d: 0.04, tipo: 'square', vol: 0.04 }),
    // la línea andando
    encender: () => { tono({ f: 110, f2: 220, d: 0.35, tipo: 'sawtooth', vol: 0.05 }); notas([392, 523], 0.07, { tipo: 'square', vol: 0.05, t: 0.1 }); },
    pausar: () => tono({ f: 220, f2: 110, d: 0.25, tipo: 'sawtooth', vol: 0.05 }),
    paso: () => { ruido({ f: 900, d: 0.05, vol: 0.15 }); tono({ f: 700, d: 0.05, tipo: 'square', vol: 0.03 }); },
    // al camión le llega una pieza correcta: la nota sube con cada pieza (do, re, mi…)
    entrega: n => tono({ f: ESCALA[Math.max(0, Math.min(ESCALA.length - 1, (n || 1) - 1))], d: 0.14, tipo: 'sine', vol: 0.14 }),
    error: () => { tono({ f: 196, d: 0.18, tipo: 'square', vol: 0.06 }); tono({ f: 147, d: 0.35, tipo: 'square', vol: 0.06, t: 0.2 }); },
    // resultado
    gana: () => { notas([523, 659, 784, 1047], 0.11, { tipo: 'square', vol: 0.06 }); tono({ f: 1047, d: 0.5, tipo: 'triangle', vol: 0.12, t: 0.44 }); tono({ f: 1319, d: 0.5, tipo: 'triangle', vol: 0.08, t: 0.44 }); },
    pierde: () => notas([392, 349, 294], 0.16, { tipo: 'triangle', vol: 0.1 })
  };

  return {
    efecto(nombre, arg) {
      if (!activo || !EFECTOS[nombre] || !iniciar()) return;
      try { EFECTOS[nombre](arg); } catch (e) { /* sin sonido */ }
    },
    get activo() { return activo; },
    alternar() {
      activo = !activo;
      try { localStorage.setItem(CLAVE, activo ? 'si' : 'no'); } catch (e) { /* sin guardado */ }
      return activo;
    }
  };
}

export const Sonido = crearSonido();
