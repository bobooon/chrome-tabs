import type { Settings } from './settings.ts'
import json from '../../locales/en/messages.json' with { type: 'json' }
import { getDefaultSettings } from './settings.ts'

const messages = json as { [key: string]: { message: string } }

export const api = {
  getMessage: (key: string, substitutions?: string | string[]): string => {
    try {
      return chrome.i18n.getMessage(key, substitutions)
    }
    catch {
      return messages[key]?.message || ''
    }
  },
  getSettings: async () => {
    try {
      return await chrome.runtime.sendMessage({ type: 'getSettings' }) as Settings
    }
    catch {
      return getDefaultSettings()
    }
  },
  saveSettings: async (settings: Settings) => {
    try {
      await chrome.runtime.sendMessage({ type: 'saveSettings', payload: settings })
    }
    catch {
      console.dir(settings)
    }
  },
  getCommands: async (): Promise<chrome.commands.Command[]> => {
    try {
      return await chrome.runtime.sendMessage({ type: 'getCommands' })
    }
    catch {
      return []
    }
  },
  createTab: async (url: string) => {
    try {
      await chrome.tabs.create({ url })
    }
    catch {
      console.dir(url)
    }
  },
}
