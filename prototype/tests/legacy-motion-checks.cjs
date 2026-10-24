module.exports = async function (api) {
  const {
    viewport,
    section,
    click,
    check,
    evaluate,
    wait,
    escape,
    shot,
    sleep,
    cdp,
    base,
  } = api;
  const ready =
    "document.getElementById('museo-exhibitions').dataset.legacyMotion==='ready'";
  const viewerReady =
    "document.querySelector('.md-legacy-viewer')?.dataset.legacyViewerMotion==='ready'";
  const clean =
    "!document.querySelector('.md-legacy-exit-layer,.md-legacy-image-flight')";
  const fit = require("./legacy-exhibition-checks.cjs").fit;
  await cdp("Emulation.setFocusEmulationEnabled", { enabled: true });
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await viewport(1440, 960);
  await section("overview");
  await sleep(150);
  await click(".md-screen-dot[data-section=exhibitions]");
  await wait(
    "!document.getElementById('museo-exhibitions').hidden",
    "heritage screen appears",
  );
  await wait(
    "document.getElementById('museo-exhibitions').dataset.legacyMotion==='opening'&&new Set([...document.querySelectorAll('[data-legacy-id]')].map(card=>getComputedStyle(card).opacity)).size>1",
    "staggered heritage entrance",
  );
  await check(
    "document.getElementById('museo-exhibitions').dataset.legacyMotion==='opening'&&new Set([...document.querySelectorAll('[data-legacy-id]')].map(card=>getComputedStyle(card).opacity)).size>1",
    "heritage cards arrive in staggered groups rather than fading as one grid",
  );
  await wait(ready, "heritage mosaic settles");
  await check(
    "[...document.querySelectorAll('[data-legacy-id]')].every(card=>getComputedStyle(card).opacity==='1'&&card.style.filter==='')",
    "mosaic settles with crisp photographs and complete content",
  );
  await click("[data-legacy-id=memory]");
  await check(
    "document.querySelector('.md-legacy-viewer')?.open&&!!document.querySelector('.md-legacy-image-flight')&&document.querySelector('.md-legacy-image-flight').inert&&document.querySelector('.md-legacy-image-flight').getAttribute('aria-hidden')==='true'",
    "the selected photograph expands into the native exhibition dialog without duplicate accessible content",
  );
  await wait(viewerReady, "shared photograph expansion finishes");
  await check(clean, "opening disposes its shared image layer");
  const paused = await evaluate(
    "document.querySelector('.md-legacy-texture').style.transform",
  );
  await sleep(250);
  await check(
    `document.querySelector('.md-legacy-texture').style.transform===${JSON.stringify(paused)}`,
    "reading pauses the architectural texture behind the exhibition",
  );
  await check(
    fit,
    "expanded exhibition keeps its reader and navigation inside one frame",
  );
  await shot("legacy-effects-exhibition-desktop");
  await click("[data-legacy-page=next]");
  await check(
    "document.querySelector('.md-legacy-viewer').dataset.legacyViewerMotion==='changing'",
    "reading pages transition as complete frames",
  );
  await click("[data-legacy-chapter-link=photographs]");
  await click("[data-legacy-chapter-link=context]");
  await wait(viewerReady, "queued chapter navigation settles");
  await check(
    "document.querySelector('.md-legacy-viewer-page').dataset.legacyChapter==='context'",
    "rapid chapter choices resolve to the last requested chapter",
  );
  await escape();
  await check(
    "document.querySelector('.md-legacy-viewer')?.dataset.legacyViewerMotion==='closing'&&!!document.querySelector('.md-legacy-image-flight')",
    "closing returns the photograph to the heritage card",
  );
  await wait(
    "!document.querySelector('.md-legacy-viewer')",
    "exhibition closing completes",
  );
  await check(
    clean +
      "&&document.activeElement.dataset.legacyId==='memory'&&document.querySelector('[data-legacy-id=memory]').dataset.explored==='true'",
    "returning removes image layers, restores focus and remembers the explored value",
  );
  await click("[data-legacy-filter=culture]");
  await check(
    "document.getElementById('museo-exhibitions').dataset.legacyMotion==='rearranging'&&document.querySelectorAll('.md-legacy-card-ghost').length===4&&document.querySelector('.md-legacy-exit-layer').inert",
    "filtering keeps outgoing cards decorative while the remaining cards rearrange",
  );
  await sleep(80);
  await check(
    "document.querySelector('[data-legacy-id=identity]').style.transform!==''",
    "retained heritage cards move through their previous positions",
  );
  await wait(ready, "culture heritage filter settles");
  await check(
    clean +
      "&&document.querySelectorAll('[data-legacy-id]').length===2&&(()=>{const p=document.querySelector('[data-legacy-filter=culture]').getBoundingClientRect(),i=document.querySelector('.md-legacy-filter-indicator').getBoundingClientRect();return Math.abs(p.left-i.left)<1&&Math.abs(p.width-i.width)<1})()",
    "the shared filter capsule lands under its selected group and old cards are removed",
  );
  await click("[data-legacy-filter=history]");
  await click("[data-legacy-filter=continuity]");
  await click("[data-legacy-filter=all]");
  await wait(ready, "rapid heritage filters settle");
  await check(
    clean + "&&document.querySelectorAll('[data-legacy-id]').length===6",
    "rapid filter changes retain the final selection and remove outgoing card layers",
  );
  const point = await evaluate(
    "const r=document.querySelector('[data-legacy-id=architecture]').getBoundingClientRect();({x:r.left+r.width*.75,y:r.top+r.height*.3})",
  );
  await cdp("Input.dispatchMouseEvent", { type: "mouseMoved", ...point });
  await sleep(500);
  await check(
    "document.querySelector('[data-legacy-id=architecture]').style.getPropertyValue('--legacy-image-x')!==''&&Number(getComputedStyle(document.querySelector('[data-legacy-id=identity]')).opacity)<.8&&document.getElementById('museo-exhibitions').style.getPropertyValue('--legacy-spot-opacity')==='.055'",
    "desktop hover softly pans one photograph and dims neighboring cards",
  );
  await cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x: 15, y: 15 });
  await sleep(500);
  await shot("legacy-effects-desktop");
  await click("[data-legacy-id=architecture]");
  await escape();
  await wait(
    "!document.querySelector('.md-legacy-viewer')",
    "Escape during photograph expansion",
  );
  await check(
    clean,
    "Escape during opening cleans up the exhibition and shared photograph",
  );
  await click("[data-legacy-filter=culture]");
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await wait(ready, "live reduced heritage motion");
  await check(
    clean +
      "&&document.getElementById('museo-exhibitions').dataset.reducedMotion==='true'&&document.querySelectorAll('[data-legacy-id]').length===2",
    "live reduced motion immediately reveals the final filtered values",
  );
  await click("[data-legacy-id=artistry]");
  await check(
    viewerReady + "&&" + clean,
    "reduced motion opens the complete reader without image flight",
  );
  await click("[data-legacy-page=next]");
  await check(viewerReady, "reduced reading pages change immediately");
  await escape();
  await viewport(390, 844);
  await click("[data-legacy-filter=all]");
  await shot("legacy-effects-phone");
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await wait(ready, "phone heritage entrance");
  await click("[data-legacy-id=continuity]");
  await viewport(667, 375);
  await wait(viewerReady, "rotation completes image expansion");
  await sleep(200);
  await check(
    clean + "&&" + fit,
    "rotation during image expansion retains readable pages and removes the obsolete flight",
  );
  await shot("legacy-effects-exhibition-landscape");
  await click("[data-legacy-page=next]");
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await wait(viewerReady, "live reduced exhibition pages");
  await check(
    fit,
    "changing motion preferences during a page transition preserves its complete content",
  );
  await escape();
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await viewport(1440, 960);
  await wait(ready, "restored heritage motion");
  await click("[data-legacy-filter=history]");
  await section("overview");
  await check(
    clean,
    "leaving heritage during filtering disposes outgoing cards",
  );
  await section("exhibitions");
  await wait(ready, "heritage reentry");
  await check(
    "document.querySelector('[data-legacy-id=memory]').dataset.explored==='true'&&document.querySelectorAll('[data-legacy-id]').length===1",
    "section reentry retains its filter and exploration memory",
  );
  await cdp("Page.navigate", { url: base + "/" });
  await wait(
    "document.querySelector('.landmark-carousel-card[data-site-id=bao-tang-khmer]')",
    "host museum landmark",
    35000,
  );
  await click(".landmark-carousel-card[data-site-id=bao-tang-khmer]");
  await wait(
    "document.querySelector('[data-action=show-location-details]')",
    "host quick window",
  );
  await click("[data-action=show-location-details]");
  await wait(
    "document.querySelector('.md-root')",
    "host museum details",
    35000,
  );
  await section("exhibitions");
  await wait(ready, "host heritage entrance");
  await click("[data-legacy-filter=culture]");
  await evaluate(
    "document.querySelector('.heritage-app').classList.add('access-reduce-motion')",
  );
  await wait(ready, "host accessibility stops heritage motion");
  await check(
    clean +
      "&&document.getElementById('museo-exhibitions').dataset.reducedMotion==='true'",
    "the map host accessibility preference stops active heritage effects",
  );
  await click("[data-legacy-id=identity]");
  await check(
    viewerReady + "&&" + clean,
    "the host accessibility preference also applies to the exhibition",
  );
  await escape();
  await evaluate(
    "document.querySelector('.heritage-app').classList.remove('access-reduce-motion')",
  );
  await wait(ready, "host heritage effects resume");
  await click("[data-legacy-filter=all]");
  await wait(ready, "host full mosaic");
  await check(
    "document.querySelectorAll('.md-section:not([hidden])').length===1",
    "heritage effects retain one full-width section in the map host",
  );
  await shot("legacy-effects-host");
};
