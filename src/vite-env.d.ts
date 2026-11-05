/// <reference types="vite/client" />

declare module 'virtual:git' {
  export type Commit = {
    hash: string
    short: string
    author: string
    date: string
    subject: string
    add: number
    del: number
  }
  export const commits: Commit[]
  export const postCommits: Record<string, Commit>
}
