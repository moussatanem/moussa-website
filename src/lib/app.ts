import { createContext, useContext } from 'react'
import { T, type Lang, type Strings } from './i18n'

export type Theme = 'light' | 'dark'

export type AppCtx = {
  lang: Lang
  t: Strings
  theme: Theme
  toggleLang: () => void
  toggleTheme: () => void
  openSearch: () => void
  openAgent: () => void
}

export const App = createContext<AppCtx>({
  lang: 'en',
  t: T.en,
  theme: 'light',
  toggleLang: () => {},
  toggleTheme: () => {},
  openSearch: () => {},
  openAgent: () => {},
})

export const useApp = () => useContext(App)

export function readPref<V extends string>(key: string, allowed: readonly V[], fallback: V): V {
  try {
    const v = localStorage.getItem(key)
    if (v && (allowed as readonly string[]).includes(v)) return v as V
  } catch {
    /* storage unavailable */
  }
  return fallback
}

export function writePref(key: string, v: string) {
  try {
    localStorage.setItem(key, v)
  } catch {
    /* storage unavailable */
  }
}
