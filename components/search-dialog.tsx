"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ChevronRight } from "lucide-react";
import type { NichePrompts } from "@/lib/supabase";

interface SearchDialogProps {
  niches: Record<string, NichePrompts>;
  onNicheSelect: (nicheName: string) => void;
  isLoading: boolean;
  onOpen: () => Promise<void>;
}

interface SearchResult {
  nicheName: string;
  matches: Array<{
    field: keyof NichePrompts;
    preview: string;
  }>;
}

export function SearchDialog({ niches, onNicheSelect, isLoading, onOpen }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Load data when dialog opens
  useEffect(() => {
    if (open) {
      onOpen();
    }
  }, [open, onOpen]);

  // Search through prompts
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    Object.entries(niches).forEach(([nicheName, prompts]) => {
      const matches: Array<{
        field: keyof NichePrompts;
        preview: string;
      }> = [];

      Object.entries(prompts).forEach(([field, content]) => {
        if (typeof content === 'string' && content.toLowerCase().includes(query)) {
          const index = content.toLowerCase().indexOf(query);
          const start = Math.max(0, index - 40);
          const end = Math.min(content.length, index + query.length + 40);
          let preview = content.slice(start, end);
          
          if (start > 0) preview = '...' + preview;
          if (end < content.length) preview = preview + '...';

          matches.push({
            field: field as keyof NichePrompts,
            preview
          });
        }
      });

      if (matches.length > 0) {
        results.push({ nicheName, matches });
      }
    });

    setSearchResults(results);
  }, [searchQuery, niches]);

  const handleNicheClick = (nicheName: string) => {
    onNicheSelect(nicheName);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? 'Loading niches...' : 'Search prompts...'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Search Prompts</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search prompt content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
          <ScrollArea className="h-[calc(80vh-120px)]">
            <div className="space-y-4">
              {searchResults.map(({ nicheName, matches }) => (
                <div key={nicheName} className="border rounded-lg p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg font-semibold mb-2"
                    onClick={() => handleNicheClick(nicheName)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {nicheName}
                  </Button>
                  <div className="space-y-2 pl-6">
                    {matches.map(({ field, preview }, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-stone-600">{field}:</span>
                        <p className="mt-1 text-stone-800 bg-stone-50 p-2 rounded">
                          {preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {searchQuery && searchResults.length === 0 && (
                <div className="text-center text-stone-500 py-8">
                  No results found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
} 