module.exports = async function ({
  viewport,
  section,
  click,
  check,
  evaluate,
  wait,
  escape,
  sleep,
  cdp,
}) {
  await cdp("Emulation.setFocusEmulationEnabled", { enabled: true });
  await viewport(320, 568);
  await section("exhibitions");
  await click("[data-legacy-filter=all]");
  await click("[data-legacy-id=continuity]");
  await sleep(150);
  await evaluate("document.querySelector('#md-dialog-title').focus()");
  const first = await evaluate(
    "document.querySelector('.md-legacy-page-count').textContent",
  );
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
  });
  await check(
    `document.querySelector('.md-legacy-page-count').textContent!==${JSON.stringify(first)}&&!document.getElementById('museo-exhibitions').hidden`,
    "keyboard arrows turn exhibition pages without changing the heritage screen",
  );
  await evaluate(
    "document.querySelector('.md-legacy-photo-thumbnails button:nth-child(2)').focus()",
  );
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "ArrowRight",
    code: "ArrowRight",
    windowsVirtualKeyCode: 39,
  });
  await check(
    "document.querySelector('.md-legacy-photo-thumbnails button:nth-child(2)').getAttribute('aria-pressed')==='true'",
    "keyboard arrows in the gallery change the photograph instead of the reading page",
  );
  await click("[data-legacy-chapter-link]:nth-child(3)");
  await sleep(120);
  await click("[data-legacy-page=next]");
  await sleep(100);
  const position = await evaluate(
    "const b=document.querySelector('[data-legacy-current-page] [data-block-id]');({id:b.dataset.blockId,offset:Number(b.dataset.blockOffset)})",
  );
  await viewport(844, 390);
  await sleep(250);
  await check(
    `(()=>{const position=${JSON.stringify(position)};return [...document.querySelectorAll('[data-legacy-current-page] [data-block-id]')].some(b=>b.dataset.blockId===position.id&&Number(b.dataset.blockOffset)<=position.offset&&Number(b.dataset.blockOffset)+b.querySelector('.md-legacy-block-text').textContent.split(' ').filter(Boolean).length>position.offset)})()`,
    "rotating an open reading retains the passage at its current word position",
  );
  await check(
    require("./legacy-exhibition-checks.cjs").fit,
    "rotated reading keeps its complete current page inside the frame",
  );
  await viewport(390, 844);
  await sleep(200);
  await click("[data-legacy-chapter-link=overview]");
  const page = await evaluate(
      "document.querySelector('.md-legacy-page-count').textContent",
    ),
    y = await evaluate(
      "const r=document.querySelector('.md-legacy-main-image').getBoundingClientRect();r.top+r.height/2",
    );
  await cdp("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 1,
  });
  await cdp("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 280, y }],
  });
  for (let step = 1; step <= 6; step++) {
    await cdp("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 280 - step * 30, y }],
    });
    await sleep(25);
  }
  await cdp("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await wait(
    `document.querySelector('.md-legacy-page-count').textContent!==${JSON.stringify(page)}`,
    "horizontal phone swipe turns exhibition page",
  );
  await check(
    "!document.getElementById('museo-exhibitions').hidden&&document.querySelector('.md-legacy-viewer')?.open",
    "real horizontal swiping keeps the native exhibition and heritage section open",
  );
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: false });
  await escape();
};
