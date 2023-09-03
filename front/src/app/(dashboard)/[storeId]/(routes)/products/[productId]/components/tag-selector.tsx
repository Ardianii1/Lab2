import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { Plus } from 'lucide-react';
import React from 'react'

interface TagSelectorProps {
  title: string;
  options: {
    id: string;
    name: string;
  }[];
  selectedTags: string[];
  onTagSelect: (tagValue: string) => void;
  onTagDeselect: (tagValue: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  title,
  options,
  selectedTags,
  onTagSelect,
  onTagDeselect,
}) => {
  console.log(selectedTags)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Plus className="mr-2 h-4 w-4" />
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedTags.includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      if (isSelected) {
                        onTagDeselect(option.id);
                      } else {
                        onTagSelect(option.id);
                      }
                    }}
                  >
                    {/* Display the tag */}
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      {isSelected && <CheckIcon className={cn("h-4 w-4")} />}
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedTags.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      // Clear all selected tags
                      selectedTags.forEach((tag) => onTagDeselect(tag));
                    }}
                    className="justify-center text-center"
                  >
                    Clear tags
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};