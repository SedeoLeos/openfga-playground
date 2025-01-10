'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import ChevronIcon from '../icons/Chevron';

type AccordionContextType = {
  activeItem: string;
  setActiveItem: (id: string) => void;
  items: string[];
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export function CustomAccordion({
  children,
  defaultValue,
  value,
  className = '',
}: {
  children: React.ReactNode;
  defaultValue: string;
  value?: string;
  className?: string;
}) {
  const [activeItem, setActiveItem] = useState<string>(defaultValue);
  const [items] = useState<string[]>(['item-1', 'item-2']);

  useEffect(() => {
    if (value) {
      setActiveItem(value);
    }
  }, [value]);
  const handleSetActiveItem = (id: string) => {
    if (id === activeItem) {
      // Si on ferme le panneau actif, ouvrir l'autre
      const otherItem = items.find(item => item !== id);
      if (otherItem) {
        setActiveItem(otherItem);
      }
    } else {
      setActiveItem(id);
    }
  };

  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem: handleSetActiveItem, items }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function CustomAccordionItem({
  children,
  value,
  className = '',
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');

  const isOpen = context.activeItem === value;

  return (
    <div className={`${className} ${isOpen ? 'flex-grow' : 'flex-initial'} overflow-hidden flex `}>
      {children}
    </div>
  );
}

export function CustomAccordionTrigger({
  children,
  value,
  className = '',
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const isOpen = context.activeItem === value;

  const handleClick = () => {
    context.setActiveItem(value);
  };

  return (
    <button
      className={`flex items-center justify-start w-full  min-w-fit p-2 ${className} ${!isOpen ? 'hover:text-blue-600 border-t border-t-white/10' : 'border-b  border-b-white/5 border-t border-t-white/10'}`}
      onClick={handleClick}
    >
      {children}
      <ChevronIcon className={`transition-transform duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
    </button>
  );
}

export function CustomAccordionContent({
  children,
  value,
  className = '',
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const isOpen = context.activeItem === value;

  return (
    <div
      className={`
        transform transition-all duration-700 ease-out origin-top
        ${className}
        ${isOpen
          ? 'flex-1'
          : 'flex-initial h-0 opacity-0 pointer-events-none'
        }
      `}
    >
      {children}
    </div>
  );
}
