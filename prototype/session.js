/* The deadline follows displayed content, not user activity. */
class ContentSession {
  constructor(onExpire, now = () => Date.now(), duration = 300000) {
    this.onExpire = onExpire;
    this.now = now;
    this.duration = duration;
    this.startedAt = null;
    this.content = null;
  }
  enter(content) { this.content = content; this.startedAt = this.now(); }
  stop() { this.content = null; this.startedAt = null; }
  check() {
    if (this.startedAt !== null && this.now() - this.startedAt > this.duration) {
      this.stop();
      this.onExpire();
      return true;
    }
    return false;
  }
}
if (typeof module !== 'undefined') module.exports = { ContentSession };
else window.ContentSession = ContentSession;
