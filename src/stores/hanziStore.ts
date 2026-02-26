import { mutation, store } from '@tanstack/store'

export interface HanziState {
  // 当前汉字列表
  characters: string[]
  // 当前索引 (当字符列表为空时为 -1)
  currentIndex: number
  // 当前模式：'watch' | 'practice'
  mode: 'watch' | 'practice'
  // 是否加载中
  isLoading: boolean
}

export const hanziStore = store<HanziState>({
  characters: [],
  currentIndex: -1,  // 使用 -1 表示无有效字符
  mode: 'watch',
  isLoading: false,
})

export const setCharacters = mutation(hanziStore, 'setCharacters', (draft, chars: string[]) => {
  draft.characters = chars
  draft.currentIndex = chars.length > 0 ? 0 : -1
})

export const nextCharacter = mutation(hanziStore, 'nextCharacter', (draft) => {
  if (draft.currentIndex < draft.characters.length - 1) {
    draft.currentIndex += 1
  }
})

export const previousCharacter = mutation(hanziStore, 'previousCharacter', (draft) => {
  if (draft.currentIndex > 0) {
    draft.currentIndex -= 1
  }
})

export const setMode = mutation(hanziStore, 'setMode', (draft, mode: 'watch' | 'practice') => {
  draft.mode = mode
})

export const setLoading = mutation(hanziStore, 'setLoading', (draft, loading: boolean) => {
  draft.isLoading = loading
})
