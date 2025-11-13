import type { Settings } from '../extension/settings.ts'

interface State { settings: Settings }

const actions = {
  setSettings: (state: State, value: Settings) => {
    state.settings = structuredClone(value)
  },
  setPreserveEmpty: (state: State, value: boolean) => {
    state.settings.preserveEmpty = value
  },
  setPreservePinned: (state: State, value: boolean) => {
    state.settings.preservePinned = value
  },
  setPreserveGrouped: (state: State, value: boolean) => {
    state.settings.preserveGrouped = value
  },
}

type Action = {
  [K in keyof typeof actions]: {
    type: K
    value: Parameters<typeof actions[K]>[1]
  }
}[keyof typeof actions]

export function pageReducer(prevState: State, action: Action) {
  const state = structuredClone(prevState)

  if (actions[action.type]) {
    const handler = actions[action.type] as (state: State, value: any) => void
    handler(state, action.value)
  }

  return state
}
