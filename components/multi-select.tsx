"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  setSelected: (selected: string[]) => void
  placeholder?: string
  allowCreate?: boolean
}

export function MultiSelect({
  options,
  selected,
  setSelected,
  placeholder = "Select items...",
  allowCreate = false,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (item: string) => {
    setSelected(selected.filter((i) => i !== item))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          setSelected(selected.slice(0, -1))
        }
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }

  const selectOption = (value: string) => {
    if (!selected.includes(value)) {
      setSelected([...selected, value])
    }
    setInputValue("")
  }

  const handleCreateOption = () => {
    if (inputValue.trim() !== "" && !selected.includes(inputValue) && !options.includes(inputValue)) {
      selectOption(inputValue)
    }
  }

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((item) => (
            <Badge key={item} variant="secondary" className="mb-1 mr-1">
              {item}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(item)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(item)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && (inputValue.length > 0 || options.length > 0) && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {allowCreate && inputValue.length > 0 && (
                <CommandItem onSelect={handleCreateOption} className="cursor-pointer">
                  Create "{inputValue}"
                </CommandItem>
              )}
              {options
                .filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
                .map((option) => (
                  <CommandItem key={option} onSelect={() => selectOption(option)} className="cursor-pointer">
                    {option}
                  </CommandItem>
                ))}
              {options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase())).length === 0 &&
                !allowCreate && <CommandItem disabled>No results found.</CommandItem>}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
