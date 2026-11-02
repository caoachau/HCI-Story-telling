import { createServer } from 'vite';
import fs from 'node:fs';
const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [], include: [] } });
try {
  const memorial = await server.ssrLoadModule('/src/features/den-tho-bac/content.ts');
  const conChim = await server.ssrLoadModule('/src/features/con-chim/data/kt01Stories.ts');
  const layers = await server.ssrLoadModule('/src/features/con-chim/data/storyLayers.ts');
  fs.mkdirSync('preview', { recursive: true });
  fs.writeFileSync('preview/locale-source.json', JSON.stringify({ memorial: memorial.STORIES, conChim: conChim.DISCOVERY_STORIES, layers: layers.STORY_LAYERS }, null, 2));
  console.log(JSON.stringify({ memorial: memorial.STORIES.map(item => ({ id: item.id, title: item.title })), conChim: conChim.DISCOVERY_STORIES.map(item => ({ id: item.id, title: item.title })) }));
} finally { await server.close(); }
