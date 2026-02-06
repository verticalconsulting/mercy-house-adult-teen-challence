import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileSelect({ value, onValueChange, placeholder, children, triggerClassName, ...props }) {
  const [open, setOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    );
  }

  // Extract items from children
  const items = React.Children.toArray(children);
  const selectedItem = items.find(child => child.props.value === value);
  const displayValue = selectedItem?.props.children || placeholder;

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn("w-full justify-between", triggerClassName)}
      >
        {displayValue}
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
            {items.map((item) => {
              const itemValue = item.props.value;
              const isSelected = itemValue === value;
              return (
                <button
                  key={itemValue}
                  onClick={() => {
                    onValueChange(itemValue);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-4 text-left rounded-lg mb-2 transition-colors",
                    isSelected 
                      ? "bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold font-medium" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <span className="text-lg">{item.props.children}</span>
                  {isSelected && <Check className="w-5 h-5 text-navy dark:text-gold" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}