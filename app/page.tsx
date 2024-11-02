"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Braces, ChevronRight, Database, Loader2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { PromptsSection } from "@/components/prompts-section";
import { fetchNiches, fetchNichePrompts, updateNichePrompts, createNichePrompt, type NichePrompts, testConnection } from "@/lib/supabase";
import { SearchDialog } from "@/components/search-dialog";
import { FindReplaceDialog } from "@/components/find-replace-dialog";
import { AddNicheDialog } from "@/components/add-niche-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePromptStore } from "@/hooks/use-prompt-store";
import { cn } from "@/lib/utils";

export default function Home() {
  const promptStore = usePromptStore();
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [localPrompts, setLocalPrompts] = useState<NichePrompts | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Simplified connection test
  useEffect(() => {
    testConnection()
      .then(isConnected => {
        console.log('Database connection status:', isConnected);
        if (!isConnected) {
          toast({
            title: "Connection Error",
            description: "Could not connect to the database",
            variant: "destructive",
          });
        }
      })
      .catch(error => {
        console.error('Connection test error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to test database connection",
          variant: "destructive",
        });
      });
  }, [toast]);

  // Only fetch niche names initially
  const { data: niches = [], isLoading: isLoadingNiches } = useQuery({
    queryKey: ['niches'],
    queryFn: fetchNiches,
  });

  // Fetch single niche data only when selected
  const { data: nichePrompts, isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['niche', selectedNiche],
    queryFn: () => selectedNiche ? fetchNichePrompts(selectedNiche) : null,
    enabled: !!selectedNiche,
  });

  // Track loaded niches for search/replace
  const [loadedNiches, setLoadedNiches] = useState<Record<string, NichePrompts>>({});

  // Update loaded niches when a niche is selected and loaded
  useEffect(() => {
    if (selectedNiche && nichePrompts) {
      setLoadedNiches(prev => ({
        ...prev,
        [selectedNiche]: nichePrompts
      }));
    }
  }, [selectedNiche, nichePrompts]);

  // Update loaded niches when changes are saved
  const updateLoadedNichesCache = (updatedNiches: Record<string, NichePrompts>) => {
    setLoadedNiches(prev => ({
      ...prev,
      ...updatedNiches
    }));
  };

  // Simple filter for niches - no state, just a filter
  const filteredNiches = searchQuery 
    ? niches.filter(niche => 
        niche.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : niches;

  // Update local prompts when niche data changes
  useEffect(() => {
    if (nichePrompts && selectedNiche) {
      promptStore.setOriginalData(selectedNiche, nichePrompts);
      const pendingChanges = promptStore.getPendingChanges(selectedNiche);
      setLocalPrompts(pendingChanges || nichePrompts);
    }
  }, [nichePrompts, selectedNiche]);

  // Add mutation for updates
  const { mutate: updatePrompts, isPending: isUpdating } = useMutation({
    mutationFn: (updates: { nicheName: string; changes: NichePrompts }) => {
      return updateNichePrompts(updates.nicheName, updates.changes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['niche', selectedNiche] });
      toast({
        description: "Changes saved successfully",
      });
    },
  });

  const handlePromptUpdate = (field: keyof NichePrompts, value: string) => {
    if (!selectedNiche || !localPrompts) return;
    const updatedPrompts = { ...localPrompts, [field]: value };
    setLocalPrompts(updatedPrompts);
    promptStore.updatePrompt(selectedNiche, field, value);
  };

  const handleReset = (field?: keyof NichePrompts) => {
    if (!selectedNiche || !nichePrompts) return;
    if (field) {
      // Reset single field
      handlePromptUpdate(field, nichePrompts[field] || '');
    } else {
      // Reset all fields
      setLocalPrompts(nichePrompts);
      promptStore.clearChanges(selectedNiche);
    }
  };

  // Track loading state for all niches data
  const [isLoadingAllData, setIsLoadingAllData] = useState(false);

  // Function to load all niches data for search/replace
  const loadAllNichesData = async () => {
    setIsLoadingAllData(true);
    try {
      const data: Record<string, NichePrompts> = {};
      await Promise.all(
        niches.map(async (nicheName) => {
          const nicheData = await fetchNichePrompts(nicheName);
          if (nicheData) {
            data[nicheName] = nicheData;
          }
        })
      );
      return data;
    } finally {
      setIsLoadingAllData(false);
    }
  };

  // Memoize the loaded data
  const [nichesData, setNichesData] = useState<Record<string, NichePrompts>>({});

  // Load data when needed for search/replace
  const ensureNichesData = async () => {
    if (Object.keys(nichesData).length === 0) {
      setIsLoadingAllData(true);
      try {
        const data = await loadAllNichesData();
        setNichesData(data);
      } finally {
        setIsLoadingAllData(false);
      }
    }
  };

  // Prefetch handler for search/replace functionality
  const prefetchNicheData = async (nicheName: string) => {
    if (!queryClient.getQueryData(['niche', nicheName])) {
      await queryClient.prefetchQuery({
        queryKey: ['niche', nicheName],
        queryFn: () => fetchNichePrompts(nicheName),
      });
    }
  };

  // Effect for window close warning - memoized dependencies
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(promptStore.pendingChanges).length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [promptStore.pendingChanges]);

  const handleNicheSelect = useCallback((nicheName: string) => {
    setSelectedNiche(nicheName);
  }, []);

  const handleSaveAll = async () => {
    try {
      const updatedNiches: Record<string, NichePrompts> = {};
      
      await Promise.all(
        Object.entries(promptStore.pendingChanges).map(async ([nicheName, changes]) => {
          await updateNichePrompts(nicheName, changes);
          updatedNiches[nicheName] = changes;
        })
      );
      
      // Update our cache with the saved changes
      updateLoadedNichesCache(updatedNiches);
      
      promptStore.clearChanges();
      queryClient.invalidateQueries({ queryKey: ['niche'] });
      toast({
        description: "All changes saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save all changes",
      });
    }
  };

  // Single niche save handler
  const handleSave = async () => {
    if (!selectedNiche || !localPrompts) return;
    
    try {
      await updateNichePrompts(selectedNiche, localPrompts);
      
      // Update our cache with the saved changes
      updateLoadedNichesCache({
        [selectedNiche]: localPrompts
      });
      
      promptStore.clearChanges(selectedNiche);
      queryClient.invalidateQueries({ queryKey: ['niche', selectedNiche] });
      toast({
        description: "Changes saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to save changes",
      });
    }
  };

  // Get the most up-to-date niche data (including unsaved changes)
  const getCurrentNicheData = (nicheName: string): NichePrompts | null => {
    const pendingChanges = promptStore.getPendingChanges(nicheName);
    if (pendingChanges) {
      return pendingChanges;
    }
    return loadedNiches[nicheName] || null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Agent Prompts Management
              </h1>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-lg">
              Manage and customize AI agent prompts across different niches
            </p>
            <div className="flex gap-4 mb-6">
              <SearchDialog 
                niches={Object.fromEntries(
                  Object.keys(loadedNiches).map(nicheName => [
                    nicheName,
                    getCurrentNicheData(nicheName) || loadedNiches[nicheName]
                  ])
                )}
                onNicheSelect={setSelectedNiche}
                isLoading={isLoadingPrompts}
                onOpen={async () => {/* Only loaded niches are searchable */}}
              />
              <FindReplaceDialog
                niches={Object.fromEntries(
                  Object.keys(loadedNiches).map(nicheName => [
                    nicheName,
                    getCurrentNicheData(nicheName) || loadedNiches[nicheName]
                  ])
                )}
                onReplace={(updates) => {
                  Object.entries(updates).forEach(([nicheName, updatedPrompts]) => {
                    promptStore.setPendingChanges(nicheName, updatedPrompts);
                    if (nicheName === selectedNiche) {
                      setLocalPrompts(updatedPrompts);
                    }
                  });
                }}
                isLoading={isLoadingPrompts}
                onOpen={async () => {/* Only loaded niches are available */}}
              />
              <Button
                variant="outline"
                onClick={() => handleReset()}
                disabled={Object.keys(promptStore.pendingChanges).length === 0}
                className="text-foreground"
              >
                Reset All Changes
              </Button>
              <Button
                onClick={handleSaveAll}
                disabled={Object.keys(promptStore.pendingChanges).length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes ({Object.keys(promptStore.pendingChanges).length})
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-3 p-4 bg-card border-border/50">
            <div className="space-y-4">
              <Input
                placeholder="Search niches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background"
              />

              <div className="h-[calc(100vh-300px)] overflow-y-auto">
                {isLoadingNiches ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredNiches.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNiches.map((niche) => (
                      <Button
                        key={niche}
                        variant={selectedNiche === niche ? "secondary" : "ghost"}
                        className="w-full justify-start relative"
                        onClick={() => setSelectedNiche(niche)}
                      >
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {niche}
                        {promptStore.hasChanges(niche) && (
                          <div className="ml-auto flex items-center gap-1">
                            <span className="text-xs text-orange-600 dark:text-orange-400">
                              {promptStore.getModifiedFields(niche).length} changes
                            </span>
                            <div className="w-2 h-2 rounded-full bg-orange-500 dark:bg-orange-400" />
                          </div>
                        )}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No niches found
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="lg:col-span-9 p-6">
            {selectedNiche ? (
              isLoadingPrompts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : localPrompts ? (
                <PromptsSection
                  data={localPrompts}
                  originalData={nichePrompts || null}
                  onUpdate={handlePromptUpdate}
                  onReset={handleReset}
                  modifiedFields={new Set(promptStore.getModifiedFields(selectedNiche))}
                />
              ) : null
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Select a niche to edit prompts
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}