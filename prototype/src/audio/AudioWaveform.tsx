import { useEffect, useState } from 'react';
const cache = new Map<string, Promise<number[]>>();
function peaks(url: string) {
  if (!cache.has(url)) {
    const task = (async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Waveform unavailable');
      const context = new OfflineAudioContext(1, 1, 22050);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      const data = buffer.getChannelData(0), count = 100;
      const bins = Array.from({ length: count }, (_, index) => {
        const from = Math.floor(index * data.length / count), to = Math.floor((index + 1) * data.length / count);
        let peak = 0;
        for (let sample = from; sample < to; sample += 4) peak = Math.max(peak, Math.abs(data[sample]));
        return peak;
      });
      const max = Math.max(...bins, .001);
      return bins.map(value => value / max);
    })();
    cache.set(url, task);
    if (cache.size > 8) cache.delete(cache.keys().next().value!);
    task.catch(() => { cache.delete(url); });
  }
  return cache.get(url)!;
}
export function AudioWaveform({ src, progress }: { src: string; progress: number }) {
  const [data, setData] = useState<number[]>([]);
  useEffect(() => {
    let active = true; setData([]);
    void peaks(src).then(values => { if (active) setData(values); }).catch(() => { /* The native seek slider remains usable without a decoded waveform. */ });
    return () => { active = false; };
  }, [src]);
  return <div className="ha-waveform" data-waveform={data.length ? 'ready' : 'unavailable'} aria-hidden="true"><svg viewBox="0 0 400 44" preserveAspectRatio="none">{data.length ? data.map((value, index) => <rect key={index} x={index * 4} y={22 - Math.max(2, value * 19)} width="1.7" height={Math.max(4, value * 38)} rx=".85" fill={index / data.length <= progress ? '#d1a17a' : '#6b5c50'} />) : <line x1="0" x2="400" y1="22" y2="22" stroke="#6b5c50" strokeWidth="2" />}</svg></div>;
}
