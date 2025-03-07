// utils/localStorage.ts

const THEME_KEY = "theme"; // Ключ для темы
const FILTERS_KEY = "filters"; // Ключ для фильтров
const PAGE_KEY = "page"; // Ключ для текущей страницы

/**
 * Сохраняет значение темы в localStorage.
 * @param theme - 'dark' или 'light'
 */
export function saveTheme(theme: "dark" | "light") {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Получает текущую тему из localStorage.
 * @returns 'dark', 'light' или null, если тема не установлена
 */
export function getSavedTheme(): "dark" | "light" | null {
  return localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
}

/**
 * Сохраняет фильтры в localStorage.
 * @param filters - Объект с фильтрами { genres: number[], type: string }
 */
export function saveFilters(filters: { genres: number[]; type: string }) {
  localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
}

/**
 * Получает сохраненные фильтры из localStorage.
 * @returns Объект с фильтрами или null, если фильтры не установлены
 */
export function getSavedFilters(): { genres: number[]; type: string } | null {
  const savedFilters = localStorage.getItem(FILTERS_KEY);
  return savedFilters ? JSON.parse(savedFilters) : null;
}

/**
 * Сохраняет текущую страницу в localStorage.
 * @param page - Номер страницы
 */
export function savePage(page: number) {
  localStorage.setItem(PAGE_KEY, page.toString());
}

/**
 * Получает сохраненную страницу из localStorage.
 * @returns Номер страницы или 1, если страница не установлена
 */
export function getSavedPage(): number {
  const savedPage = localStorage.getItem(PAGE_KEY);
  return savedPage ? parseInt(savedPage, 10) : 1;
}