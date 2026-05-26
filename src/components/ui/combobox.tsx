'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type ComboboxProps = {
  data?: { label: string; value: string }[]
  onSelect?: (value: string) => void
  defaultValue?: string
  placeholder?: string
}

export function Combobox({ data = [], defaultValue, onSelect, placeholder = 'Select…' }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue ?? '')

  React.useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
      onSelect?.(defaultValue)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="truncate">
            {value ? data.find((item) => item.value === value)?.label ?? placeholder : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(v) => {
                    setValue(v === value ? '' : v)
                    onSelect?.(v)
                    setOpen(false)
                  }}
                >
                  <Check className={cn('mr-2 size-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
