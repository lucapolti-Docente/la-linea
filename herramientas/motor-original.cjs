/* Carga el juego original (original/la-linea.html) en Node, con una pantalla de mentira,
   para comparar su motor con el nuevo en los tests. No se usa en el juego. */
const fs = require('fs'), path = require('path'), vm = require('vm');

module.exports = function cargarOriginal() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'original', 'la-linea.html'), 'utf8');
  const a = html.indexOf('<script>') + 8, b = html.lastIndexOf('</script>');
  let js = html.slice(a, b);
  // Anotar cada cartel que muestra el motor.
  js = js.replace("function toast(msg,kind=''){", "function toast(msg,kind=''){globalThis.__carteles.push(msg);");
  const i = js.lastIndexOf('})();');
  js = js.slice(0, i) + 'globalThis.__O={step,resetProduction,startLevel,station,getG:()=>G,setWorld:w=>{WORLD=w},WORLDS};\n' + js.slice(i);
  function stub() {
    const f = function () { return stub(); };
    return new Proxy(f, {
      get(t, k) {
        if (k === Symbol.toPrimitive) return () => '';
        if (k === 'then') return undefined;
        if (k === 'length') return 0;
        if (k === 'matches') return false;
        if (k === Symbol.iterator) return function* () {};
        return stub();
      },
      set() { return true; },
      apply() { return stub(); }
    });
  }
  let reloj = 1000;
  const ctx = {
    console, Math, JSON, Object, Array, String, Number, Boolean, Date, Map, Set, Symbol, Proxy, Reflect, Error, parseInt, parseFloat, isNaN, Infinity,
    document: stub(), matchMedia: () => ({ matches: false }), requestAnimationFrame: () => 0, setTimeout: () => 0, clearTimeout() {},
    performance: { now: () => (reloj += 7) }, localStorage: { getItem: () => null, setItem() {} }, addEventListener() {}, scrollTo() {},
    devicePixelRatio: 1, navigator: stub(), innerWidth: 1366, innerHeight: 768, __carteles: []
  };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(js, ctx, { filename: 'la-linea-original.js' });
  return Object.assign(ctx.__O, { carteles: ctx.__carteles });
};
