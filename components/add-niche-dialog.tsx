"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, CopyPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { NichePrompts } from "@/lib/supabase";

interface AddNicheDialogProps {
  onAdd: (nicheName: string) => Promise<void>;
  isAdding: boolean;
  mode?: 'create' | 'duplicate';
  sourceNiche?: { name: string };
}

export function AddNicheDialog({ onAdd, isAdding, mode = 'create', sourceNiche }: AddNicheDialogProps) {
  const [open, setOpen] = useState(false);
  const [nicheName, setNicheName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateNicheName = (name: string) => {
    if (!name.trim()) {
      setError("Please enter a niche name");
      return false;
    }

    const existingNiches = queryClient.getQueryData<string[]>(['niches']) || [];
    if (existingNiches.includes(name.trim())) {
      setError("A niche with this name already exists");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNicheName(nicheName)) {
      return;
    }

    try {
      await onAdd(nicheName.trim());
      setNicheName("");
      setOpen(false);
    } catch (error) {
      setError("Failed to create niche");
    }
  };

  const handleInputChange = (value: string) => {
    setNicheName(value);
    if (value.trim()) {
      validateNicheName(value);
    } else {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={mode === 'create' ? "shrink-0" : "opacity-0 group-hover:opacity-100 transition-opacity"}
        >
          {mode === 'create' ? (
            <Plus className="h-4 w-4" />
          ) : (
            <CopyPlus className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Niche' : `Duplicate Niche: ${sourceNiche?.name}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nicheName">Niche Name</Label>
            <Input
              id="nicheName"
              value={nicheName}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === 'create' ? "Enter new niche name..." : `Copy of ${sourceNiche?.name}`}
              disabled={isAdding}
              autoFocus
              className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500 animate-in">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setNicheName("");
                setError(null);
              }}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding || !nicheName.trim() || !!error}
            >
              {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Niche' : 'Duplicate Niche'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 