export const defaultSettings = {
  preservePinned: true,
  preserveGrouped: true,
  preserveEmpty: true,
}

export type Settings = typeof defaultSettings

export function getDefaultSettings() {
  return structuredClone(defaultSettings) as Settings
}
