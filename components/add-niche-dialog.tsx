"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Braces, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AddNicheDialogProps {
  onAdd: (nicheName: string) => Promise<void>;
  isAdding: boolean;
}

export function AddNicheDialog({ onAdd, isAdding }: AddNicheDialogProps) {
  const [open, setOpen] = useState(false);
  const [nicheName, setNicheName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nicheName.trim()) {
      toast({
        description: "Please enter a niche name",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAdd(nicheName.trim());
      setNicheName("");
      setOpen(false);
      toast({
        description: "Niche created successfully",
      });
    } catch (error) {
      toast({
        description: "Failed to create niche",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-stone-100/50">
          <Braces className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Niche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nicheName">Niche Name</Label>
            <Input
              id="nicheName"
              value={nicheName}
              onChange={(e) => setNicheName(e.target.value)}
              placeholder="Enter niche name..."
              disabled={isAdding}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding || !nicheName.trim()}
            >
              {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Niche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 