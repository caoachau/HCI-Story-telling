const assert = require("node:assert/strict");
const normalized = (text) => text.replace(/\s+/g, " ").trim();
const fit = `(()=>{
  const dialog=document.querySelector('.md-legacy-viewer'), panel=document.querySelector('.md-legacy-viewer-panel'), content=document.querySelector('[data-legacy-current-page]');
  const r=dialog.getBoundingClientRect(), p=panel.getBoundingClientRect(), c=content.getBoundingClientRect();
  return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&panel.scrollWidth<=panel.clientWidth+1&&panel.scrollHeight<=panel.clientHeight+1&&content.scrollHeight<=content.clientHeight+1&&content.scrollWidth<=content.clientWidth+1
  &&[...content.children].every(block=>{const b=block.getBoundingClientRect();return b.top>=c.top-1&&b.bottom<=c.bottom+1})
  &&[...document.querySelectorAll('.md-legacy-viewer-close,.md-legacy-viewer-nav button')].filter(button=>!button.disabled).every(button=>{const b=button.getBoundingClientRect();return b.top>=p.top&&b.bottom<=p.bottom&&button.contains(document.elementFromPoint(b.left+b.width/2,b.top+b.height/2))});
})()`;

async function collectReading(
  { click, evaluate, wait, check, sleep },
  label,
  verify = true,
) {
  await click("[data-legacy-chapter-link=overview]");
  await sleep(150);
  const original = await evaluate(
    "[...document.querySelectorAll('[data-measure-block]')].map(block=>({id:block.dataset.measureBlock,text:block.querySelector('.md-legacy-block-text').textContent}))",
  );
  const read = new Map();
  let pages = 0;
  while (pages++ < 100) {
    await wait(
      "document.querySelector('.md-legacy-viewer').dataset.legacyViewerMotion==='ready'",
      label + " page motion",
    );
    await sleep(45);
    if (verify) {
      if (!(await evaluate(fit)))
        console.log(
          "Legacy reader bounds:",
          await evaluate(
            "[...document.querySelectorAll('.md-legacy-viewer,.md-legacy-viewer-panel,[data-legacy-current-page],[data-legacy-current-page] section,.md-legacy-viewer-close,.md-legacy-viewer-nav button')].map(el=>({class:el.className,rect:el.getBoundingClientRect().toJSON(),height:el.clientHeight,scroll:el.scrollHeight,width:el.clientWidth,scrollWidth:el.scrollWidth,hit:el.contains(document.elementFromPoint(el.getBoundingClientRect().left+el.clientWidth/2,el.getBoundingClientRect().top+el.clientHeight/2))}))",
          ),
        );
      await check(
        fit,
        label +
          " page " +
          pages +
          " exposes complete copy and reachable controls without vertical scrolling",
      );
    }
    const visible = await evaluate(
      "[...document.querySelectorAll('[data-legacy-current-page] [data-block-id]')].map(block=>({id:block.dataset.blockId,offset:Number(block.dataset.blockOffset),text:block.querySelector('.md-legacy-block-text').textContent}))",
    );
    for (const block of visible) {
      if (!read.has(block.id)) read.set(block.id, new Map());
      read.get(block.id).set(block.offset, block.text);
    }
    if (
      await evaluate(
        "document.querySelector('[data-legacy-page=next]').disabled",
      )
    )
      break;
    await click("[data-legacy-page=next]");
  }
  assert.ok(pages < 100, "pagination terminates");
  for (const block of original) {
    const fragments = read.get(block.id);
    assert.ok(fragments, label + " exposes " + block.id);
    assert.equal(
      normalized(
        [...fragments]
          .sort((a, b) => a[0] - b[0])
          .map((item) => item[1])
          .join(" "),
      ),
      normalized(block.text),
      label + " preserves every word of " + block.id,
    );
  }
  console.log(
    "PASS " +
      label +
      " preserves all " +
      original.length +
      " content blocks across " +
      pages +
      " reading pages",
  );
  return original.map((block) => block.text).join(" ");
}

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
  } = api;
  await viewport(1440, 960);
  await section("exhibitions");
  await click("[data-legacy-filter=all]");
  await check(
    "document.querySelector('#md-exhibitions-title').textContent==='DẤU ẤN & GIÁ TRỊ DI SẢN'&&document.querySelectorAll('[data-legacy-id]').length===6",
    "heritage retains its full-width six-card composition",
  );
  await check(
    "[...document.querySelectorAll('[data-legacy-id] img')].every(img=>img.complete&&img.naturalWidth>0)&&!document.getElementById('museo-exhibitions').textContent.match(/UNESCO|36,000|PALEOLITHIC|ICE AGE/)",
    "heritage uses authentic Khmer museum and community photographs",
  );
  for (const id of [
    "memory",
    "architecture",
    "identity",
    "artistry",
    "living-landscape",
    "continuity",
  ]) {
    await evaluate(
      `document.querySelector('[data-legacy-id="${id}"]').focus()`,
    );
    await click('[data-legacy-id="' + id + '"]');
    await wait(
      `document.querySelector('[data-legacy-story="${id}"]')&&document.querySelector('.md-legacy-viewer')?.open`,
      id + " exhibition",
    );
    await sleep(160);
    await check(
      "document.activeElement.id==='md-dialog-title'&&document.querySelectorAll('[data-legacy-chapter-link]').length===7&&document.querySelectorAll('.md-legacy-photo-thumbnails button').length===3",
      id +
        " opens a focused exhibition with seven chapters and three documentary photographs",
    );
    const text = await collectReading(api, id);
    if (id === "memory")
      assert.ok(
        text.includes("Bảo tàng Tổng hợp Trà Vinh") &&
          text.includes("thế kỷ V–VI") &&
          text.includes("2012"),
        "treasure custody, chronology and memorial date remain explicit",
      );
    if (id === "continuity")
      assert.ok(
        text.includes("gợi mở cho tương lai") && text.includes("2026"),
        "future proposals remain distinct from documented activities",
      );
    for (let photo = 2; photo <= 3; photo++) {
      await click(
        ".md-legacy-photo-thumbnails button:nth-child(" + photo + ")",
      );
      await wait(
        "document.querySelector('.md-legacy-main-image').complete&&document.querySelector('.md-legacy-main-image').naturalWidth>0",
        id + " photograph " + photo,
      );
      await check(
        "document.querySelector('.md-legacy-main-image').src===document.querySelector('.md-legacy-photo-thumbnails button[aria-pressed=true] img').src&&document.querySelector('.md-legacy-visual figcaption a').href.startsWith('https://')",
        id + " photograph " + photo + " retains its own source",
      );
      await click("[data-legacy-chapter-link=photographs]");
      await check(
        "document.querySelector('[data-legacy-current-page]').textContent.length>50",
        id +
          " exposes the complete documentary caption in its photography chapter",
      );
    }
    await escape();
    await wait(
      "!document.querySelector('.md-legacy-viewer')",
      id + " exhibition closes",
    );
    await check(
      `document.activeElement===document.querySelector('[data-legacy-id="${id}"]')&&document.querySelector('[data-legacy-id="${id}"]').dataset.explored==='true'`,
      id + " returns focus and keeps a subtle explored marker",
    );
  }
  await click("[data-legacy-id=memory]");
  await click(".md-legacy-next button:last-child");
  await check(
    "document.querySelector('[data-legacy-story=architecture]')!==null&&document.activeElement.id==='md-dialog-title'",
    "changing heritage values resets the reader and focuses its current title",
  );
  await escape();
  await check(
    "document.activeElement===document.querySelector('[data-legacy-id=architecture]')",
    "closing the second value restores focus to its current card",
  );
  for (const [id, destination, selected] of [
    ["memory", "timeline", "formation"],
    ["architecture", "map", "architecture"],
    ["identity", "tour", "satra"],
    ["artistry", "tour", "youngmakers"],
    ["living-landscape", "map", "pond"],
    ["continuity", "tour", "thachsang"],
  ]) {
    await section("exhibitions");
    await click("[data-legacy-filter=all]");
    await click('[data-legacy-id="' + id + '"]');
    await click("[data-legacy-chapter-link=context]");
    while (
      !(await evaluate(
        "Boolean(document.querySelector('[data-legacy-explore]'))",
      ))
    )
      await click("[data-legacy-page=next]");
    await click("[data-legacy-explore]");
    await wait(
      `!document.getElementById('museo-${destination}').hidden&&!document.querySelector('.md-legacy-viewer')`,
      id + " related destination",
    );
    const selector =
        destination === "tour"
          ? "#museo-tour"
          : destination === "map"
            ? ".md-featured-site"
            : "[data-history-detail]",
      attribute =
        destination === "tour"
          ? "cultureTopic"
          : destination === "map"
            ? "selectedPlace"
            : "historyDetail";
    await check(
      `document.querySelector('${selector}').dataset.${attribute}==='${selected}'`,
      id + " links to its matching story or location",
    );
  }
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [1280, 600],
    [1920, 500],
    [768, 960],
    [390, 844],
    [320, 568],
    [844, 390],
    [667, 375],
  ]) {
    await viewport(width, height);
    await section("exhibitions");
    await click("[data-legacy-filter=all]");
    await click("[data-legacy-id=continuity]");
    await sleep(160);
    await collectReading(api, width + "x" + height + " conservation reading");
    if (width === 1920 || width === 390 || width === 320 || width === 667) {
      await click("[data-legacy-chapter-link=overview]");
      await shot("legacy-exhibition-" + width + "x" + height);
    }
    await escape();
    await wait(
      "!document.querySelector('.md-legacy-viewer')",
      "responsive exhibition closes",
    );
  }
};
module.exports.collectReading = collectReading;
module.exports.fit = fit;
