module.exports = async function quickWindowChecks(api, motion = false) {
  const {
    viewport,
    cdp,
    base,
    wait,
    click,
    check,
    evaluate,
    shot,
    sleep,
    escape,
  } = api;
  const ready =
    "document.querySelector('.lqv-root')?.dataset.quickMotion==='ready'";
  const imageReady =
    "document.querySelector('.lqv-visual')?.dataset.photoStatus==='ready'&&document.querySelector('.lqv-photo>img').complete&&document.querySelector('.lqv-photo>img').naturalWidth>0";
  const sizes = [
    [1920, 1080],
    [1440, 960],
    [1366, 768],
    [1024, 768],
    [768, 960],
    [640, 400],
    [390, 844],
    [320, 568],
    [844, 390],
    [667, 375],
  ];
  const open = async (id) => {
    await click('.landmark-carousel-card[data-site-id="' + id + '"]');
    await wait(
      `document.querySelector('.lqv-root')?.dataset.siteId===${JSON.stringify(id)}&&` +
        ready,
      id + " side panel",
      45000,
    );
    await wait(imageReady, id + " photograph", 30000);
  };
  await viewport(1440, 960);
  await cdp("Emulation.setFocusEmulationEnabled", { enabled: true });
  await cdp("Emulation.setEmulatedMedia", {
    features: [
      {
        name: "prefers-reduced-motion",
        value: motion ? "no-preference" : "reduce",
      },
    ],
  });
  await cdp("Page.navigate", { url: base + "/" });
  await wait(
    "document.querySelectorAll('.landmark-carousel-card').length===7",
    "landmark dock",
    45000,
  );
  if (motion) {
    await open("bao-tang-khmer");
    await check(
      "document.querySelector('.heritage-story-panel').getAnimations().length===0&&document.querySelector('.lqv-root').getAnimations().length===0&&document.querySelector('.lqv-hero').getAnimations({subtree:true}).length===0",
      "window and hero appear without entrance or image animation",
    );
    await check(
      "getComputedStyle(document.querySelector('.lqv-footer button')).backgroundColor==='rgb(242, 199, 127)'&&getComputedStyle(document.querySelector('.lqv-tabs [aria-selected=true]')).color==='rgb(242, 199, 127)'&&getComputedStyle(document.querySelector('.lqv-address svg')).color==='rgb(242, 199, 127)'",
      "CTA, selected tab and address use the marker gold",
    );
    await evaluate("document.fonts.ready");await sleep(300);
    await evaluate("window.__sidePanel=document.querySelector('.lqv-root');window.__photoBox=document.querySelector('.lqv-photo>img').getBoundingClientRect().toJSON();void 0");
    const hover=await evaluate("const r=document.querySelector('.lqv-photo').getBoundingClientRect();({x:r.left+r.width*.7,y:r.top+r.height*.7})");
    await cdp("Input.dispatchMouseEvent",{type:"mouseMoved",...hover});await sleep(180);
    await cdp("Input.dispatchMouseEvent",{type:"mouseMoved",x:hover.x-65,y:hover.y-45});await sleep(180);
    await check(
      "(()=>{const i=document.querySelector('.lqv-photo>img'),r=i.getBoundingClientRect(),s=getComputedStyle(i);return ['x','y','width','height'].every(k=>Math.abs(r[k]-window.__photoBox[k])<.1)&&(s.transform==='none'||new DOMMatrixReadOnly(s.transform).isIdentity)&&s.translate==='none'&&i.getAnimations().length===0&&!document.querySelector('.lqv-photo-light')})()",
      "hover cannot pan, zoom, fade or light the photograph",
    );
    await shot("side-panel-gold-static-desktop");
    await open("chua-ang");
    await check(
      "document.querySelector('.lqv-root')===window.__sidePanel&&document.querySelector('.heritage-story-panel').getAnimations().length===0&&document.querySelector('.lqv-root').getAnimations().length===0&&document.querySelector('.lqv-hero').getAnimations({subtree:true}).length===0&&!document.querySelector('[data-quick-site-ghost],[data-quick-map-pulse]')",
      "destination replacement retains a static panel without photo ghosts or pulses",
    );
    await check(
      "[...document.querySelectorAll('.heritage-marker__model,.heritage-marker__image,.heritage-marker__ripple')].every(el=>el.getAnimations().length===0)",
      "map photograph markers never float or pulse",
    );
    await click("[data-quick-tab=highlights]");
    await check(
      "document.querySelector('.lqv-tab-indicator').getAnimations().some(a=>a.playState==='running')&&document.querySelector('[data-quick-page-ghost]')!==null&&document.querySelector('.lqv-hero').getAnimations({subtree:true}).length===0",
      "clicking a tab animates its indicator and reading content only",
    );
    await wait("document.querySelector('.lqv-root').dataset.quickPageMotion==='idle'","tab settles");
    await click(".lqv-highlights .lqv-page-navigation button:last-child");
    await check("document.querySelector('.lqv-highlights .lqv-reader-outgoing')!==null","page button retains its reading transition");
    await wait("!document.querySelector('.lqv-reader-outgoing')","reading settles");
    await click('[data-quick-thumbnail="1"]');await wait(imageReady,"selected photograph");
    await check("!document.querySelector('.lqv-photo-previous')&&document.querySelector('.lqv-photo>img').getAnimations().length===0&&document.querySelector('.lqv-visual').getAnimations().length===0","photo selection is immediate without a crossfade");
    await cdp("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"reduce"}]});
    await wait("document.querySelector('.lqv-root').dataset.reducedMotion==='true'","live reduced motion");
    await check("document.querySelector('.lqv-root').getAnimations({subtree:true}).every(a=>a.playState!=='running')","reduced motion stops control transitions");
    await cdp("Emulation.setEmulatedMedia",{features:[{name:"prefers-reduced-motion",value:"no-preference"}]});
    await open("bao-tang-khmer");
    await viewport(390, 844);
    await sleep(200);
    const y = await evaluate(
      "const r=document.querySelector('.lqv-photo').getBoundingClientRect();r.top+r.height/2",
    );
    await cdp("Emulation.setTouchEmulationEnabled", {
      enabled: true,
      maxTouchPoints: 1,
    });
    await cdp("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 290, y }],
    });
    for (let n = 1; n <= 6; n++) {
      await cdp("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 290 - n * 30, y }],
      });
      await sleep(25);
    }
    await cdp("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await wait(imageReady, "phone swipe");
    await check(
      "document.querySelector('.lqv-photo>img').dataset.quickPhoto==='1'",
      "phone swipe browses photographs",
    );
    await cdp("Emulation.setTouchEmulationEnabled", { enabled: false });
    await evaluate(
      "document.querySelector('.lqv-photo-controls button').focus()",
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
    await wait(imageReady, "keyboard photograph");
    await check(
      "document.querySelector('.lqv-photo>img').dataset.quickPhoto==='2'",
      "keyboard arrows browse photographs",
    );
    await click('[data-quick-thumbnail="0"]');
    await click('[data-quick-thumbnail="1"]');
    await click('[data-quick-thumbnail="2"]');
    await wait(imageReady, "rapid photographs");
    await wait(
      "!document.querySelector('.lqv-photo-previous')",
      "rapid photograph cleanup",
    );
    await shot("side-panel-mobile");
    await click(".lqv-close");
    await wait("!document.querySelector('.lqv-root')", "immediate close");
    await check(
      "document.activeElement.dataset.siteId==='bao-tang-khmer'",
      "close restores keyboard focus",
    );
    return;
  }
  const failures = [];
  const fit =
    "const r=document.querySelector('.lqv-root'),b=r.getBoundingClientRect(),body=r.querySelector('[data-quick-section]:not([hidden]) .lqv-reader-body'),br=body.getBoundingClientRect(),cta=r.querySelector('[data-action=show-location-details]'),c=cta.getBoundingClientRect();b.left>=0&&b.right<=innerWidth&&b.top>=0&&b.bottom<=innerHeight&&r.scrollHeight<=r.clientHeight+1&&r.querySelector('.lqv-layout').scrollHeight<=r.querySelector('.lqv-layout').clientHeight+1&&body.scrollHeight<=body.clientHeight+1&&[...body.querySelectorAll('p,h4,dd,dt,a')].every(el=>{const d=el.getBoundingClientRect();return d.top>=br.top-1&&d.bottom<=br.bottom+1&&d.left>=br.left-1&&d.right<=br.right+1})&&cta.contains(document.elementFromPoint(c.left+c.width/2,c.top+c.height/2))";
  let combinations = 0;
  for (const id of [
    "ao-ba-om",
    "chua-ang",
    "chua-hang",
    "den-tho-bac",
    "con-chim",
    "bien-ba-dong",
    "bao-tang-khmer",
  ]) {
    await open(id);
    await check(
      "document.querySelectorAll('[data-quick-tab]').length===3&&document.querySelector('.lqv-hero .lqv-title-block')&&document.querySelector('.lqv-hero .lqv-visual')&&document.querySelector('.lqv-sheet .lqv-tabs')&&document.querySelectorAll('.lqv-toolbar button').length===2",
      id + " uses a photo hero, reading sheet, tabs and a compact QR/close header",
    );
    const photos = await evaluate(
      "document.querySelectorAll('[data-quick-thumbnail]').length||1",
    );
    for (let n = 0; n < photos; n++) {
      if (photos > 1) await click('[data-quick-thumbnail="' + n + '"]');
      await wait(imageReady, "documented photograph");
      await check(
        `document.querySelector('.lqv-photo>img').dataset.quickPhoto==='${n}'&&document.querySelector('.lqv-photo>img').alt.length>10`,
        id + " photograph " + n + " retains its description",
      );
    }
    for (const lang of ["vi", "en"]) {
      if (lang === "en") await click('button[title="Chuyển sang English"]');
      for (const [w, h] of sizes) {
        await viewport(w, h);
        await sleep(100);
        for (const topic of ["overview", "highlights", "visit"]) {
          await click("[data-quick-tab=" + topic + "]");
          await sleep(40);
          const source = await evaluate(
            "[...document.querySelector('[data-quick-section]:not([hidden]) .lqv-reader-measure').children].map(el=>({id:el.dataset.quickBlock,text:el.querySelector(':scope>p')?.textContent,heading:el.querySelector('h4')?.textContent,widget:el.querySelector(':scope>p')?null:el.textContent}))",
          );
          // React applies one page per event, so reset by repeated discrete events.
          let current = await evaluate(
            "+document.querySelector('[data-quick-section]:not([hidden]) .lqv-reader').dataset.readerPage",
          );
          while (current-- > 0)
            await click(
              "[data-quick-section]:not([hidden]) .lqv-page-navigation button:first-of-type",
            );
          const count = await evaluate(
            "+document.querySelector('[data-quick-section]:not([hidden]) .lqv-reader').dataset.readerPages",
          );
          const seen = [];
          for (let n = 0; n < count; n++) {
            combinations++;
            if (!(await evaluate(fit)))
              failures.push({
                id,
                lang,
                w,
                h,
                topic,
                n,
                bounds: await evaluate(
                  "const root=document.querySelector('.lqv-root');[...root.querySelectorAll('.lqv-layout,.lqv-title-block,.lqv-visual,.lqv-tabs,.lqv-information,[data-quick-section]:not([hidden]) .lqv-reader-body,.lqv-footer')].map(el=>({class:el.className,rect:el.getBoundingClientRect().toJSON(),height:el.clientHeight,content:el.scrollHeight}))",
                ),
              });
            seen.push(
              ...(await evaluate(
                "[...document.querySelector('[data-quick-section]:not([hidden]) .lqv-reader-body').children].map(el=>({id:el.dataset.quickBlock.split(':')[0],text:el.querySelector(':scope>p')?.textContent,heading:el.querySelector('h4')?.textContent,widget:el.querySelector(':scope>p')?null:el.textContent}))",
              )),
            );
            if (n < count - 1)
              await click(
                "[data-quick-section]:not([hidden]) .lqv-page-navigation button:last-child",
              );
          }
          const normalize = (s) => (s ?? "").replace(/\s+/g, " ").trim();
          for (const original of source) {
            const parts = seen.filter((item) => item.id === original.id);
            if (
              normalize(parts.map((item) => item.text ?? "").join(" ")) !==
                normalize(original.text) ||
              normalize(parts.map((item) => item.heading ?? "").join(" ")) !==
                normalize(original.heading) ||
              (!original.text &&
                !original.heading &&
                normalize(parts.map((item) => item.widget ?? "").join(" ")) !==
                  normalize(original.widget))
            )
              throw Error(
                "Lost reading content: " +
                  JSON.stringify({ id, lang, w, h, topic, original, parts }),
              );
          }
        }
      }
      await viewport(1440, 960);
    }
    await click('button[title="Switch to Vietnamese"]');
  }
  if (failures.length)
    console.log("Side panel fit failures:", JSON.stringify(failures, null, 2));
  await check(
    String(!failures.length),
    combinations +
      " reading pages preserve every word and fit all locations/languages/viewports",
  );
  await viewport(1920, 1080);
  await click("[data-quick-tab=overview]");
  await sleep(100);
  await check(
    "const r=document.querySelector('.lqv-root').getBoundingClientRect(),tools=document.querySelector('button[title=\"Phóng to\"]').parentElement.getBoundingClientRect();r.width>=420&&r.width<=innerWidth*.33&&r.left>innerWidth*.65&&tools.right+12<=r.left&&r.top>document.querySelector('.heritage-app>header').getBoundingClientRect().bottom",
    "desktop leaves most of the map visible and never covers its header or navigation toolbar",
  );
  for (const [w, h] of [
    [1920, 1080],
    [1440, 960],
    [1024, 768],
    [768, 960],
  ]) {
    await viewport(w, h);
    await sleep(350);
    await check(
      "const panel=document.querySelector('.lqv-root').getBoundingClientRect(),dock=document.querySelector('.landmark-carousel').getBoundingClientRect();dock.right+12<=panel.left&&[...document.querySelectorAll('.map-basemap-selector button,.map-top-actions button,.landmark-carousel-actions button:not([disabled])')].every(button=>{const r=button.getBoundingClientRect();return r.left>=0&&r.right<panel.left&&button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",
      w +
        "px map actions and destination navigation remain visible and usable beside the panel",
    );
    if (w === 768) await shot("side-panel-tablet");
  }
  await viewport(1920, 1080);
  await click('[data-quick-thumbnail="0"]');
  await wait(imageReady, "museum facade");
  await shot("side-panel-desktop");
  await viewport(390, 844);
  await sleep(100);
  await shot("side-panel-mobile");
  await viewport(320, 568);
  await sleep(100);
  await shot("side-panel-small-phone");
  await viewport(844, 390);
  await sleep(100);
  await shot("side-panel-landscape");
  await evaluate(
    "document.querySelector('.lqv-photo>img').dispatchEvent(new Event('error'))",
  );
  await check(
    "!!document.querySelector('.lqv-photo-fallback')&&!!document.querySelector('[data-action=show-location-details]')",
    "photo failure retains the detail action",
  );
  await click('[data-quick-thumbnail="1"]');
  await wait(imageReady, "photo recovery");
  await click(".lqv-close");
  await wait("!document.querySelector('.lqv-root')", "panel closes");
};
