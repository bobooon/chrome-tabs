import type { SwitchProps, TooltipProps } from '@radix-ui/themes'
import { Flex, IconButton, Switch, Text, Tooltip } from '@radix-ui/themes'
import { Info } from 'lucide-react'

interface UiSwitchProps extends SwitchProps {
  label: string
  tooltip?: string
}

export function UiSwitch(props: UiSwitchProps) {
  const { label, tooltip, ...restProps } = props

  return (
    <Flex asChild align="center" gap="2">
      <Text as="label" size="2">
        {tooltip && <UiTooltip content={tooltip} />}
        <Text style={{ flexGrow: 1 }}>
          {label}
        </Text>
        <Switch {...restProps} />
      </Text>
    </Flex>
  )
}

export function UiTooltip(props: TooltipProps) {
  return (
    <Tooltip {...props}>
      <IconButton variant="ghost" color="gray" size="1" radius="full">
        <Info size={16} color="gray" />
      </IconButton>
    </Tooltip>
  )
}
