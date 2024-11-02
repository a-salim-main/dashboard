"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { NichePrompts } from "@/lib/supabase";
import { FIELD_GROUPS, getUnassignedFields, type FieldGroupKey, type PromptFields } from "@/components/prompts-section";
import { cn } from "@/lib/utils";

interface ApplyToDialogProps {
  currentValue: string;
  currentField: keyof NichePrompts;
  niches: Record<string, NichePrompts>;
  onApply: (selectedFields: Array<{ niche: string; field: keyof NichePrompts; value: string }>) => void;
  onOpen?: () => Promise<void>;
  isLoading?: boolean;
}

export function ApplyToDialog({ currentValue, currentField, niches, onApply, onOpen, isLoading = false }: ApplyToDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState<Array<{ niche: string; field: keyof NichePrompts; value: string }>>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      console.log('ApplyToDialog opened with:', {
        currentValue,
        currentField,
        availableNiches: Object.keys(niches),
        nichesData: niches
      });
    }
  }, [currentValue, currentField, niches, open]);

  const handleSubmit = () => {
    console.log('Submitting with selected fields:', selectedFields);
    
    if (selectedFields.length === 0) {
      toast({
        description: "Please select at least one field to apply the text to",
        variant: "destructive",
      });
      return;
    }

    onApply(selectedFields);
    setOpen(false);
    setSelectedFields([]);
    
    toast({
      description: `Applied text to ${selectedFields.length} field${selectedFields.length === 1 ? '' : 's'}`,
    });
  };

  const toggleField = (niche: string, field: keyof NichePrompts) => {
    console.log('Toggling field:', { niche, field });
    setSelectedFields(prev => {
      const exists = prev.some(item => item.niche === niche && item.field === field);
      if (exists) {
        return prev.filter(item => !(item.niche === niche && item.field === field));
      }
      return [...prev, { niche, field, value: currentValue }];
    });
  };

  const availableNiches = Object.entries(niches).filter(
    ([nicheName, nicheData]) => nicheData["Niche Name"] !== currentField
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "hover:bg-accent hover:text-accent-foreground",
            selectedFields.length > 0 && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          disabled={isLoading}
        >
          <Share2 className="h-4 w-4 mr-2" />
          {isLoading ? 'Loading...' : selectedFields.length > 0 
            ? `Apply to ${selectedFields.length} field${selectedFields.length === 1 ? '' : 's'}`
            : 'Apply to...'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Apply Current Text to Other Fields</DialogTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {selectedFields.length > 0 ? (
              <p>{selectedFields.length} field{selectedFields.length === 1 ? '' : 's'} selected</p>
            ) : (
              <p>Available niches: {availableNiches.length}</p>
            )}
          </div>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <Accordion type="multiple" className="w-full">
            {availableNiches.map(([nicheName, nicheData]) => (
              <AccordionItem key={nicheName} value={nicheName}>
                <AccordionTrigger className="hover:no-underline">
                  {nicheData["Niche Name"] || nicheName}
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible className="w-full">
                    {Object.entries(FIELD_GROUPS).map(([groupName, fields]) => (
                      <AccordionItem key={groupName} value={groupName}>
                        <AccordionTrigger className="text-sm py-2 hover:no-underline">
                          {groupName}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 ml-4">
                            {fields.map((field: PromptFields) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${nicheName}-${field}`}
                                  checked={selectedFields.some(
                                    item => item.niche === nicheName && item.field === field
                                  )}
                                  onCheckedChange={() => toggleField(nicheName, field)}
                                  disabled={nicheName === currentField}
                                />
                                <label
                                  htmlFor={`${nicheName}-${field}`}
                                  className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    selectedFields.some(item => item.niche === nicheName && item.field === field) && 
                                    "text-primary font-semibold"
                                  )}
                                >
                                  {field}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    
                    {(() => {
                      const allPossibleFields = Object.keys(FIELD_GROUPS).reduce<PromptFields[]>(
                        (acc, groupKey) => {
                          const group = FIELD_GROUPS[groupKey as Exclude<FieldGroupKey, "Other">];
                          return [...acc, ...group];
                        },
                        []
                      );

                      const unassignedFields = getUnassignedFields(allPossibleFields);
                      
                      if (unassignedFields.length === 0) return null;
                      
                      return (
                        <AccordionItem value="other">
                          <AccordionTrigger className="text-sm py-2 hover:no-underline">
                            Other
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 ml-4">
                              {unassignedFields.map((field: PromptFields) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${nicheName}-${field}`}
                                    checked={selectedFields.some(
                                      item => item.niche === nicheName && item.field === field
                                    )}
                                    onCheckedChange={() => toggleField(nicheName, field)}
                                    disabled={nicheName === currentField}
                                  />
                                  <label
                                    htmlFor={`${nicheName}-${field}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {field}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })()}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Apply to Selected
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 