import { Box, Button, Callout, DropdownMenu, Flex, Separator, Text } from '@radix-ui/themes'
import { useEffect, useReducer, useState } from 'react'
import { api } from '../extension/api.ts'
import { getDefaultSettings } from '../extension/settings.ts'
import { pageReducer } from './reducer.ts'
import { UiSwitch } from './ui.tsx'
import './page.css'

export default function Page() {
  const [ready, setReady] = useState(false)
  const [state, dispatch] = useReducer(pageReducer, { settings: getDefaultSettings() })
  const [shortcut, setShortcut] = useState('')

  useEffect(() => {
    (async () => {
      if (!ready) {
        dispatch({ type: 'setSettings', value: await api.getSettings() })
        setReady(true)

        const commands = await api.getCommands()
        setShortcut(commands.find(cmd => cmd.name === 'close')?.shortcut || '')
      }
      else {
        await api.saveSettings(state.settings)
      }
    })()
  }, [ready, state.settings])

  if (!ready)
    return <Box p="5" className="wrapper" />

  const { settings } = state
  const id = typeof chrome.runtime !== 'undefined' ? chrome.runtime.id : ''

  return (
    <Flex p="5" direction="column" gap="3" className="wrapper">
      <Callout.Root variant="surface" color={shortcut ? 'green' : 'red'} size="1" mb="3" style={{ display: 'block' }}>
        <Flex asChild align="center" gap="2">
          <Text as="label" size="2">
            <Text style={{ flexGrow: 1 }}>{api.getMessage('shortcut')}</Text>
            <Button
              variant="classic"
              size="1"
              style={{ height: '20px' }}
              onClick={() => api.createTab('chrome://extensions/shortcuts')}
            >
              {shortcut || api.getMessage('shortcutDisabled')}
            </Button>
          </Text>
        </Flex>
      </Callout.Root>

      <UiSwitch
        label={api.getMessage('preservePinned')}
        tooltip={api.getMessage('preservePinnedHelp')}
        checked={settings.preservePinned}
        onCheckedChange={value => dispatch({ type: 'setPreservePinned', value })}
        disabled={!shortcut}
      />
      <UiSwitch
        label={api.getMessage('preserveGrouped')}
        tooltip={api.getMessage('preserveGroupedHelp')}
        checked={settings.preserveGrouped}
        onCheckedChange={value => dispatch({ type: 'setPreserveGrouped', value })}
        disabled={!shortcut}
      />
      <UiSwitch
        label={api.getMessage('preserveEmpty')}
        tooltip={api.getMessage('preserveEmptyHelp')}
        checked={settings.preserveEmpty}
        onCheckedChange={value => dispatch({ type: 'setPreserveEmpty', value })}
        disabled={!shortcut}
      />

      <Box my="3" mx="-5">
        <Separator size="4" />
      </Box>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            {api.getMessage('advanced')}
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Item onClick={() => api.createTab(`chrome://extensions/?id=${id}`)}>
            {api.getMessage('extensionInfo')}
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => api.createTab('chrome://extensions/shortcuts')}>
            {api.getMessage('extensionShortcuts')}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Flex>
  )
}
