"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Replace, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { NichePrompts } from "@/lib/supabase";

interface FindReplaceDialogProps {
  niches: Record<string, NichePrompts>;
  onReplace: (updates: Record<string, NichePrompts>) => void;
  isLoading: boolean;
  onOpen: () => Promise<void>;
}

const COMMON_PATTERNS = [
  {
    name: "Double Quotes in Expressions",
    find: '(?<=\\{\\{[^}]*)"(?=[^}]*\\}\\})',
    replace: "'",
    isRegex: true,
  }
] as const;

export function FindReplaceDialog({ niches, onReplace, isLoading, onOpen }: FindReplaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [isRegex, setIsRegex] = useState(false);
  const [selectedNiches, setSelectedNiches] = useState<Set<string>>(new Set());
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [matchPreviews, setMatchPreviews] = useState<Array<{
    nicheName: string;
    matches: Array<{
      field: keyof NichePrompts;
      content: string;
      count: number;
    }>;
  }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) onOpen();
  }, [open, onOpen]);

  // Update match previews when search params change
  useEffect(() => {
    if (!findText) {
      setMatchPreviews([]);
      return;
    }

    try {
      let matches: RegExp | string = findText;
      if (isRegex) {
        matches = new RegExp(findText, caseSensitive ? 'g' : 'gi');
      }

      const previews: typeof matchPreviews = [];

      selectedNiches.forEach(nicheName => {
        const niche = niches[nicheName];
        if (!niche) return;

        const nicheMatches: typeof matchPreviews[number]['matches'] = [];

        Object.entries(niche).forEach(([field, content]) => {
          if (typeof content === 'string') {
            let matchCount = 0;
            let matchIndices: number[] = [];

            if (isRegex && matches instanceof RegExp) {
              const regexMatches = content.match(matches);
              matchCount = regexMatches?.length || 0;
              if (regexMatches) {
                let match;
                while ((match = matches.exec(content)) !== null) {
                  matchIndices.push(match.index);
                }
                matches.lastIndex = 0; // Reset regex state
              }
            } else if (!isRegex) {
              const searchText = caseSensitive ? findText : findText.toLowerCase();
              const searchContent = caseSensitive ? content : content.toLowerCase();
              let pos = 0;
              while ((pos = searchContent.indexOf(searchText, pos)) !== -1) {
                matchIndices.push(pos);
                pos += searchText.length;
                matchCount++;
              }
            }

            if (matchCount > 0) {
              // Get preview of first match with context
              const firstMatchIndex = matchIndices[0];
              const start = Math.max(0, firstMatchIndex - 20);
              const end = Math.min(content.length, firstMatchIndex + findText.length + 20);
              let preview = content.slice(start, end);
              
              if (start > 0) preview = '...' + preview;
              if (end < content.length) preview = preview + '...';

              nicheMatches.push({
                field: field as keyof NichePrompts,
                content: preview,
                count: matchCount
              });
            }
          }
        });

        if (nicheMatches.length > 0) {
          previews.push({ nicheName, matches: nicheMatches });
        }
      });

      setMatchPreviews(previews);
    } catch (error) {
      // Invalid regex, clear previews
      setMatchPreviews([]);
    }
  }, [findText, niches, selectedNiches, caseSensitive, isRegex]);

  const handlePatternSelect = (pattern: typeof COMMON_PATTERNS[number]) => {
    setFindText(pattern.find);
    setReplaceText(pattern.replace);
    setIsRegex(pattern.isRegex);
  };

  const handleReplace = () => {
    if (!findText || !replaceText) return;

    try {
      const updates: Record<string, NichePrompts> = {};
      let totalReplacements = 0;

      selectedNiches.forEach(nicheName => {
        const niche = niches[nicheName];
        if (!niche) return;

        const updatedNiche = { ...niche };
        let nicheModified = false;

        Object.entries(niche).forEach(([field, content]) => {
          if (typeof content === 'string') {
            let newContent: string;
            let matchCount = 0;

            if (isRegex) {
              const regex = new RegExp(findText, caseSensitive ? 'g' : 'gi');
              const matches = content.match(regex);
              matchCount = matches?.length || 0;
              newContent = content.replace(regex, replaceText);
            } else {
              const searchText = caseSensitive ? findText : findText.toLowerCase();
              const searchContent = caseSensitive ? content : content.toLowerCase();
              let pos = 0;
              matchCount = 0;
              while (searchContent.indexOf(searchText, pos) !== -1) {
                matchCount++;
                pos = searchContent.indexOf(searchText, pos) + searchText.length;
              }
              
              // For case-insensitive plain text search, we need to preserve the original case
              // of the content while still matching case-insensitively
              if (!caseSensitive) {
                const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                newContent = content.replace(regex, replaceText);
              } else {
                newContent = content.split(findText).join(replaceText);
              }
            }

            if (newContent !== content) {
              updatedNiche[field as keyof NichePrompts] = newContent;
              nicheModified = true;
              totalReplacements += matchCount;
            }
          }
        });

        if (nicheModified) {
          updates[nicheName] = updatedNiche;
        }
      });

      if (Object.keys(updates).length > 0) {
        onReplace(updates);
        toast({
          description: `Made ${totalReplacements} replacements across ${Object.keys(updates).length} niches`,
        });
        setOpen(false);
      } else {
        toast({
          description: "No matches found to replace",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: isRegex ? "Invalid regular expression" : "An error occurred during replacement",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Replace className="h-4 w-4 mr-2" />
          Find & Replace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Find and Replace</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            {COMMON_PATTERNS.map((pattern) => (
              <Button
                key={pattern.name}
                variant="outline"
                onClick={() => handlePatternSelect(pattern)}
                className="justify-start font-mono text-sm"
              >
                {pattern.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="regex-mode"
              checked={isRegex}
              onCheckedChange={(checked: boolean) => setIsRegex(checked)}
            />
            <Label htmlFor="regex-mode">Use regular expressions</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="find">Find</Label>
            <Input
              id="find"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder={isRegex ? "Regular expression..." : "Text to find..."}
              className="font-mono"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="replace">Replace with</Label>
            <Input
              id="replace"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement pattern..."
              className="font-mono"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="case-sensitive"
              checked={caseSensitive}
              onCheckedChange={(checked: boolean) => setCaseSensitive(checked)}
            />
            <Label htmlFor="case-sensitive">Case sensitive</Label>
          </div>

          <div className="grid gap-2">
            <Label>Select Niches</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="grid gap-2">
                {Object.keys(niches).map((nicheName) => (
                  <div key={nicheName} className="flex items-center space-x-2">
                    <Checkbox
                      id={nicheName}
                      checked={selectedNiches.has(nicheName)}
                      onCheckedChange={(checked: boolean) => {
                        const newSelected = new Set(selectedNiches);
                        checked ? newSelected.add(nicheName) : newSelected.delete(nicheName);
                        setSelectedNiches(newSelected);
                      }}
                    />
                    <Label htmlFor={nicheName}>{nicheName}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {matchPreviews.length > 0 && (
            <div className="grid gap-2">
              <Label>
                Matches Found ({matchPreviews.reduce((sum, { matches }) => 
                  sum + matches.reduce((total, { count }) => total + count, 0), 0
                )})
              </Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="grid gap-4">
                  {matchPreviews.map(({ nicheName, matches }) => (
                    <div key={nicheName} className="space-y-2">
                      <h4 className="font-medium">{nicheName}</h4>
                      <div className="pl-4 space-y-2">
                        {matches.map(({ field, content, count }, idx) => (
                          <div key={`${field}-${idx}`} className="text-sm">
                            <div className="font-medium text-muted-foreground">
                              {field} ({count} matches)
                            </div>
                            <code className="block mt-1 p-2 rounded bg-muted text-xs whitespace-pre-wrap">
                              {content}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReplace}
            disabled={!findText || !replaceText || selectedNiches.size === 0}
          >
            Replace All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 