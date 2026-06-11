import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileSelect({ id, value, onValueChange, placeholder, children, triggerClassName, ...props }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const items = React.Children.toArray(children);
  const selectedItem = items.find(child => child.props?.value === value);
  const displayValue = selectedItem?.props?.children || placeholder;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <Button
        id={id}
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-between font-normal text-left",
          !value && "text-muted-foreground",
          triggerClassName
        )}
      >
        <span className="truncate">{displayValue}</span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-center">{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-safe overflow-y-auto" style={{ maxHeight: '55vh', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}>
            {items.map((item) => {
              const itemValue = item.props?.value;
              const isSelected = itemValue === value;
              return (
                <button
                  key={itemValue}
                  type="button"
                  onClick={() => {
                    onValueChange(itemValue);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-4 text-left rounded-xl mb-1.5 transition-colors text-base",
                    isSelected
                      ? "bg-navy/10 dark:bg-gold/10 text-navy dark:text-gold font-semibold"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
                  )}
                >
                  <span>{item.props?.children}</span>
                  {isSelected && <Check className="w-5 h-5 text-navy dark:text-gold shrink-0" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { SelectItem as MobileSelectItem };