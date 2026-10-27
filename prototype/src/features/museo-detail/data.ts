import facade from '../../assets/museo/khmer-facade.jpg';
import temple from '../../assets/museo/khmer-temple-model.jpg';
import pinpeat from '../../assets/museo/khmer-pinpeat.jpg';
import tools from '../../assets/museo/khmer-tools.jpg';
import visitors from '../../assets/museo/khmer-visitors.jpg';

// Only the five images requested by the current Khmer overview and its reader.
const sources: Record<string, string> = {
  'khmer-facade': facade,
  'khmer-temple-model': temple,
  'khmer-pinpeat': pinpeat,
  'khmer-tools': tools,
  'khmer-visitors': visitors,
};

export function artwork(name: string): string {
  return sources[name];
}
