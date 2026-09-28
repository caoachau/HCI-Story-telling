export type AppLanguage = 'vi' | 'en';

export const t = (language: AppLanguage, vietnamese: string, english: string): string =>
  language === 'vi' ? vietnamese : english;
