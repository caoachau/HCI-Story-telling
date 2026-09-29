export interface LocalWeather {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  observedAt: string;
}

const WEATHER_ENDPOINT =
  'https://api.open-meteo.com/v1/forecast?latitude=9.855&longitude=106.345&current=temperature_2m,weather_code,is_day&timezone=Asia%2FBangkok';

export async function fetchLocalWeather(signal?: AbortSignal): Promise<LocalWeather> {
  const response = await fetch(WEATHER_ENDPOINT, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Weather request failed (${response.status})`);

  const payload = await response.json() as {
    current?: {
      temperature_2m?: number;
      weather_code?: number;
      is_day?: number;
      time?: string;
    };
  };
  const current = payload.current;
  if (!current || typeof current.temperature_2m !== 'number' || typeof current.weather_code !== 'number') {
    throw new Error('Weather response is incomplete');
  }

  return {
    temperature: Math.round(current.temperature_2m),
    weatherCode: current.weather_code,
    isDay: current.is_day !== 0,
    observedAt: current.time ?? '',
  };
}

export function weatherDescription(code: number, lang: 'vi' | 'en'): string {
  const labels = lang === 'vi'
    ? ['Quang đãng', 'Chủ yếu quang', 'Mây rải rác', 'Nhiều mây', 'Sương mù', 'Mưa nhỏ', 'Mưa vừa', 'Mưa lớn', 'Dông']
    : ['Clear', 'Mostly clear', 'Partly cloudy', 'Overcast', 'Fog', 'Light rain', 'Rain', 'Heavy rain', 'Thunderstorm'];
  if (code === 0) return labels[0];
  if (code <= 1) return labels[1];
  if (code === 2) return labels[2];
  if (code === 3) return labels[3];
  if (code === 45 || code === 48) return labels[4];
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return labels[5];
  if (code === 61 || code === 63 || code === 66 || code === 80 || code === 81) return labels[6];
  if (code === 65 || code === 67 || code === 82) return labels[7];
  if (code >= 95) return labels[8];
  return lang === 'vi' ? 'Thời tiết hiện tại' : 'Current weather';
}
