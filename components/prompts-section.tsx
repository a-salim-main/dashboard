"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NichePrompts } from "@/lib/supabase";
import { unescapeString, escapeString } from "@/lib/utils";
import { PromptEditor } from "@/components/prompt-editor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export type FieldGroupKey = "Optin No Book" | "Database Reactivation" | "Appointments" | "No Show" | "Inbound" | "Call Later" | "After Hours" | "Other";

// Define a type for the field names to ensure they match NichePrompts
export type PromptFields = keyof Omit<NichePrompts, "Niche Name">;

export const FIELD_GROUPS: Record<Exclude<FieldGroupKey, "Other">, readonly PromptFields[]> = {
  "Optin No Book": [
    "Onb_Identity",
    "Onb_Task",
    "Onb_Steps",
    "ONB_Response_Guildelines",
    "ONB_Style",
    "ONB_Specifics",
    "Onb_Notes",
    "Onb_Example",
  ],
  "Database Reactivation": [
    "Dbr_Identity",
    "Dbr_Task",
    "DBR_Steps",
    "DBR_Notes",
    "DBR_Example",
  ],
  "Appointments": [
    "Appointments_Identity",
    "Confirmation_Task",
    "Confirmation_Steps",
    "Appointments Example",
    "Appointments_Notes",
    "Reminders_Task",
    "Reminders 1 Steps",
    "Reminders 2 Steps",
  ],
  "No Show": [
    "No Show Identity",
    "No Show Task",
    "No Show Steps",
  ],
  "Inbound": [
    "Inbound Identity",
    "Inbound Task",
    "Inbound Steps",
    "Inbound Response Guidlines",
    "Inbound Specifics",
    "Inbound Notes",
    "Inbound Examples",
  ],
  "Call Later": [
    "Call Later Task",
    "Call Later Steps",
    "Call Later DBR Steps",
    "Call Later Examples",
  ],
  "After Hours": [
    "Afterhours Inbound Steps",
    "Afterhours Inbound Response Guidlines",
    "Afterhours Inbound Notes",
    "Afterhours Inbound Examples",
  ],
} as const;

const GROUP_DESCRIPTIONS: Record<FieldGroupKey, string> = {
  "Optin No Book": "Prompts for handling leads who opted in but haven't booked",
  "Database Reactivation": "Prompts for reactivating leads from the database",
  "Appointments": "Prompts for handling appointment-related interactions",
  "No Show": "Prompts for following up with no-show clients",
  "Inbound": "Prompts for handling inbound inquiries",
  "Call Later": "Prompts for scheduling follow-up calls",
  "After Hours": "Prompts for after-hours responses",
  "Other": "Additional prompt configurations",
};

interface PromptsSectionProps {
  data: NichePrompts | null;
  originalData: NichePrompts | null;
  onUpdate: (field: keyof NichePrompts, value: string) => void;
  onReset: (field: keyof NichePrompts) => void;
  modifiedFields: Set<string>;
  niches: Record<string, NichePrompts>;
  onApply: (selectedFields: Array<{ niche: string; field: keyof NichePrompts; value: string }>) => void;
}

export function PromptsSection({ data, originalData, onUpdate, onReset, modifiedFields, niches, onApply }: PromptsSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<FieldGroupKey>("Optin No Book");
  const { toast } = useToast();

  if (!data || !originalData) return null;

  // Get all available fields from the data
  const availableFields = Object.keys(data) as (keyof NichePrompts)[];

  // Create a set of all fields that are explicitly assigned to groups
  const assignedFields = new Set<PromptFields>(
    Object.values(FIELD_GROUPS).flat()
  );

  // Find fields that aren't assigned to any group
  const unassignedFields = availableFields.filter(
    field => !assignedFields.has(field as PromptFields) && field !== "Niche Name"
  );

  // Create the complete groups object including dynamic "Other" group
  const allGroups = {
    ...FIELD_GROUPS,
    "Other": unassignedFields
  } as Record<FieldGroupKey, readonly (keyof NichePrompts)[]>;

  // Get available groups without modifying the original FIELD_GROUPS
  const availableGroupNames = Object.entries(allGroups)
    .filter(([_, fields]) => fields.length > 0 && fields.some(field => availableFields.includes(field)))
    .map(([group]) => group as FieldGroupKey);

  useEffect(() => {
    if (!availableGroupNames.includes(selectedGroup) && availableGroupNames.length > 0) {
      setSelectedGroup(availableGroupNames[0]);
    }
  }, [availableGroupNames, selectedGroup]);

  // Improved change detection per group
  const groupChanges = useMemo(() => {
    const changes: Record<string, number> = {};
    
    modifiedFields.forEach(field => {
      Object.entries(FIELD_GROUPS).forEach(([group, fields]) => {
        if (fields.includes(field as PromptFields)) {
          changes[group] = (changes[group] || 0) + 1;
        }
      });

      // Check unassigned fields for "Other" group
      if (!Object.values(FIELD_GROUPS).flat().includes(field as PromptFields)) {
        changes["Other"] = (changes["Other"] || 0) + 1;
      }
    });
    
    return changes;
  }, [modifiedFields]);

  // Get total changes count
  const totalChanges = useMemo(() => 
    Object.values(groupChanges).reduce((sum, count) => sum + count, 0),
    [groupChanges]
  );

  console.log('PromptsSection niches:', { niches });

  const handleResetNiche = () => {
    // Get all modified fields for the current niche, regardless of group
    const fieldsToReset = Array.from(modifiedFields);
    
    console.log('Resetting fields:', fieldsToReset); // Debug log
    
    // Reset each modified field, regardless of which group it's in
    fieldsToReset.forEach(field => {
      if (field !== "Niche Name") {
        onReset(field as keyof NichePrompts);
      }
    });

    // Force a re-render of the group changes
    const updatedGroupChanges = { ...groupChanges };
    Object.keys(updatedGroupChanges).forEach(group => {
      updatedGroupChanges[group] = 0;
    });

    toast({
      description: `Reset ${fieldsToReset.length} field${fieldsToReset.length === 1 ? '' : 's'} in current niche`,
    });
  };

  const handleSaveNiche = () => {
    if (!data) return;

    // Get all modified fields
    const modifiedFieldsList = Array.from(modifiedFields);
    
    // Create updates only for modified fields
    const updates: Array<{ niche: string; field: keyof NichePrompts; value: string }> = 
      modifiedFieldsList.map(field => ({
        niche: data["Niche Name"] as string,
        field: field as keyof NichePrompts,
        value: data[field as keyof NichePrompts] as string
      }));

    // Call onApply with the updates
    onApply(updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-background to-muted p-4 rounded-lg border border-border/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Prompt Editor
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {GROUP_DESCRIPTIONS[selectedGroup]}
            </p>
          </div>
          {totalChanges > 0 && (
            <span className="text-sm px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 animate-in-fast">
              {totalChanges} modified field{totalChanges === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {totalChanges > 0 && (
            <div className="flex gap-2 animate-in-fast">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetNiche}
                className="text-orange-600 hover:text-orange-700"
                title="Reset all changes in this niche"
              >
                Reset Niche
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNiche}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                title="Save changes for this niche"
              >
                Save Niche
              </Button>
            </div>
          )}
          <div title="Switch between prompt groups">
            <Select 
              value={selectedGroup} 
              onValueChange={(value) => setSelectedGroup(value as FieldGroupKey)}
            >
              <SelectTrigger className="w-[200px] bg-card border-border text-foreground">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableGroupNames.map((group) => (
                  <SelectItem 
                    key={group} 
                    value={group}
                    className="text-foreground hover:bg-muted focus:bg-muted flex justify-between items-center"
                  >
                    <span>{group}</span>
                    {groupChanges[group] > 0 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 animate-in-fast">
                        {groupChanges[group]}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {allGroups[selectedGroup]
          .filter(field => availableFields.includes(field as keyof NichePrompts))
          .map((field) => (
            <PromptEditor
              key={field}
              label={field}
              value={data[field as keyof NichePrompts] || ''}
              originalValue={originalData[field as keyof NichePrompts] || ''}
              onChange={(value) => onUpdate(field as keyof NichePrompts, value)}
              onReset={() => onReset?.(field as keyof NichePrompts)}
              hasChanged={modifiedFields.has(field)}
              niches={niches}
              onApply={onApply}
            />
          ))}
      </div>
    </div>
  );
}

export function getUnassignedFields(allFields: PromptFields[]): PromptFields[] {
  const assignedFields = new Set(Object.values(FIELD_GROUPS).flat());
  return allFields.filter(field => !assignedFields.has(field));
}