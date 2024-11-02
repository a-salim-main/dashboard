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

interface ApplyToDialogProps {
  currentValue: string;
  currentField: keyof NichePrompts;
  niches: string[];
  onApply: (selectedFields: Array<{ niche: string; field: keyof NichePrompts; value: string }>) => void;
  loadedNiches?: string[];
}

export function ApplyToDialog({ currentValue, currentField, niches, onApply, loadedNiches = [] }: ApplyToDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState<Array<{ niche: string; field: keyof NichePrompts; value: string }>>([]);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedFields.length === 0) {
      toast({
        description: "Please select at least one field to apply the text to",
        variant: "destructive",
      });
      return;
    }

    const fieldsWithValue = selectedFields.map(field => ({
      ...field,
      value: currentValue
    }));

    onApply(fieldsWithValue);
    setOpen(false);
    setSelectedFields([]);
    
    toast({
      description: `Applied to ${selectedFields.length} field${selectedFields.length === 1 ? '' : 's'}`,
    });
  };

  const toggleField = (niche: string, field: keyof NichePrompts) => {
    setSelectedFields(prev => {
      const exists = prev.some(item => item.niche === niche && item.field === field);
      if (exists) {
        return prev.filter(item => !(item.niche === niche && item.field === field));
      }
      return [...prev, { niche, field, value: currentValue }];
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Apply to...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Apply Current Text to Other Fields</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] mt-4 pr-4">
          <Accordion type="multiple" className="w-full">
            {niches.filter(niche => loadedNiches.includes(niche)).map((niche) => (
              <AccordionItem key={niche} value={niche}>
                <AccordionTrigger className="hover:no-underline">
                  {niche}
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
                            {(fields as Array<keyof NichePrompts>).map((field) => (
                              <div key={field} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${niche}-${field}`}
                                  checked={selectedFields.some(
                                    item => item.niche === niche && item.field === field
                                  )}
                                  onCheckedChange={() => toggleField(niche, field)}
                                  disabled={niche === currentField}
                                />
                                <label
                                  htmlFor={`${niche}-${field}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                      const allPossibleFields = Object.keys(FIELD_GROUPS).reduce<(keyof NichePrompts)[]>(
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
                              {unassignedFields.map((field) => (
                                <div key={field} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${niche}-${field}`}
                                    checked={selectedFields.some(
                                      item => item.niche === niche && item.field === field
                                    )}
                                    onCheckedChange={() => toggleField(niche, field)}
                                    disabled={niche === currentField}
                                  />
                                  <label
                                    htmlFor={`${niche}-${field}`}
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