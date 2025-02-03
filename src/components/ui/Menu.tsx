"use client"


import MenuIcon from "../icons/Menu"
import PasteIcon from "../icons/Paste"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "@/components/ui/menubar"

export function MenubarDemo({ data }: { data: { label: string, action: () => void }[] }) {
  return (
    <Menubar className="bg-transparent !border-none">
      <MenubarMenu>
        <MenubarTrigger className="bg-transparent !border-none hover:bg-primary/10 focus:bg-primary/10 focus-visible:bg-primary/10 data-[state=open]:bg-primary/10">
          <MenuIcon />
        </MenubarTrigger>
        <MenubarContent className="bg-[rgb(31,33,35)] border-[rgb(58,58,58)] text-gray-200 mx-2 px-6 py-4">
          {data.map((component, index) => (
            <MenubarItem key={index} className="flex gap-2 hover:transparent" onClick={component.action}>
              <PasteIcon />
              <span>
                {component.label}
              </span>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}


