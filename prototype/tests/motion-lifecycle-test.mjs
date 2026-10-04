// Run: node --experimental-vm-modules tests/motion-lifecycle-test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { transformWithOxc } from 'vite';

const filename = new URL('../src/features/ao-ba-om-detail/motion/useMotion.ts', import.meta.url);
const { code } = await transformWithOxc(fs.readFileSync(filename, 'utf8'), filename.pathname);
const callbacks = new Set();
let reduced = false, frames = 0, created = 0, destroyed = 0;
const scrollUpdate = () => {};
class Lenis {
  constructor() { created++; }
  on(event, callback) { this.callback = callback; }
  off(event, callback) { assert.equal(callback, this.callback); this.callback = null; }
  raf() { frames++; }
  destroy() { assert.equal(this.callback, null); destroyed++; }
}
const modules = {
  react: { useEffect() {}, useRef() {}, useCallback() {} },
  gsap: { default: { registerPlugin() {}, ticker: {
    add(callback) { callbacks.add(callback); },
    remove(callback) { callbacks.delete(callback); },
    lagSmoothing() {},
  } } },
  'gsap/ScrollTrigger': { ScrollTrigger: { update: scrollUpdate } },
  lenis: { default: Lenis },
};
const context = vm.createContext({ window: { matchMedia: () => ({ matches: reduced }) } });
const module = new vm.SourceTextModule(code, { context });
await module.link(name => {
  const exports = modules[name];
  assert.ok(exports, 'Known animation dependency: ' + name);
  return new vm.SyntheticModule(Object.keys(exports), function () {
    for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
  }, { context });
});
await module.evaluate();
const { initLenis, destroyLenis } = module.namespace;
for (let i = 0; i < 20; i++) {
  const instance = initLenis();
  assert.equal(initLenis(), instance, 'Repeated initialization shares one instance');
  assert.equal(callbacks.size, 1, 'Only one frame callback while open');
  callbacks.forEach(callback => callback(1));
  destroyLenis();
  destroyLenis();
  assert.equal(callbacks.size, 0, 'Closing removes frame callback');
}
assert.equal(frames, 20);
assert.equal(created, 20);
assert.equal(destroyed, 20);
reduced = true;
assert.equal(initLenis(), null);
assert.equal(callbacks.size, 0, 'Reduced motion does not schedule frames');
console.log('PASS 20 open/close cycles, single ticker, no frames after closing, reduced motion');
