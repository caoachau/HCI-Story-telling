const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ContentSession } = require('../session.js');

test('expires only after the same content exceeds five minutes, once',()=>{
  let now=0,expired=0;
  const session=new ContentSession(()=>expired++,()=>now);
  session.enter('story:A01');
  now=300000;assert.equal(session.check(),false);
  now=300001;assert.equal(session.check(),true);
  assert.equal(expired,1);session.check();assert.equal(expired,1);
});
test('new content starts a fresh deadline; ending a session cancels it',()=>{
  let now=0,expired=0;
  const session=new ContentSession(()=>expired++,()=>now);
  session.enter('map');now=290000;session.enter('story:A01');
  now=310000;assert.equal(session.check(),false);
  now=590001;assert.equal(session.check(),true);
  session.enter('story:A02');session.stop();now=1000000;
  assert.equal(session.check(),false);assert.equal(expired,1);
});
test('reading, overlays and background-tab return keep the content deadline',()=>{
  let now=100,expired=0;
  const session=new ContentSession(()=>expired++,()=>now);
  session.enter('panorama');
  // Hotspots and UI preferences do not call enter; check after returning to tab.
  now=900000;assert.equal(session.check(),true);assert.equal(expired,1);
});
