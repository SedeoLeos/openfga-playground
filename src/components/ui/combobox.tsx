"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"


type ComboboxProps = {
  data?: { label: string; value: string }[],
  onSelect?: (value: string) => void,
  defaultValue: string
}

export function Combobox({ data = [], defaultValue, onSelect }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  React.useEffect(() => {
    if(defaultValue){
      setValue(defaultValue)
      onSelect?.(defaultValue)
    }
  }, [defaultValue,onSelect])



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between !bg-gray-500/10 !border-none !shadow-none"
        >
          {value
            ? data.find((framework) => framework.value === value)?.label
            : "Select Store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-[rgb(31,33,35)] border-[rgb(58,58,58)]">
        <Command className="bg-[rgb(31,33,35)] border-[rgb(58,58,58)] text-gray-200">
          <CommandInput placeholder="Search Store..." className="!bg-transparent" />
          <CommandList>
            <CommandEmpty>No Store found.</CommandEmpty>
            <CommandGroup>
              {data.map((framework,index) => (
                <CommandItem
                  key={index}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onSelect?.(currentValue)
                    setOpen(false)
                  }}
                  className="bg-[rgb(31,33,35)] data-[selected=true]:bg-[rgb(31,33,35)] !text-white"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
