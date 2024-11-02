"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import { Eye, Code, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { unescapeString, escapeString } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PromptEditorProps {
  label: string;
  value: string;
  originalValue: string;
  onChange: (value: string) => void;
  onReset?: () => void;
  hasChanged?: boolean;
}

export function PromptEditor({ 
  label, 
  value, 
  originalValue,
  onChange, 
  onReset,
  hasChanged 
}: PromptEditorProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unescaped = unescapeString(value);
    if (unescaped !== displayValue) {
      setDisplayValue(unescaped);
    }
  }, [value]);

  const handleTextChange = (newValue: string) => {
    setDisplayValue(newValue);
    onChange(escapeString(newValue));
  };

  const handleReset = () => {
    if (!onReset) return;
    
    const unescaped = unescapeString(originalValue);
    setDisplayValue(unescaped);
    onReset();
    
    toast({
      description: "Reset to original value",
      duration: 1000,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isPreviewMode ? value : displayValue);
      toast({
        description: "Copied to clipboard",
        duration: 1000,
      });
    } catch (err) {
      console.error('Failed to copy text:', err);
      toast({
        variant: "destructive",
        description: "Failed to copy text",
      });
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-sm",
      value !== originalValue && "border-l-4 border-l-orange-500 dark:border-l-orange-600"
    )}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor={label}
              className="text-lg font-semibold text-foreground"
            >
              {label.replace(/_/g, ' ')}
            </Label>
            {value !== originalValue && (
              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300">
                Modified
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {value !== originalValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Reset to original"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              {isPreviewMode ? <Code className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2">{isPreviewMode ? "Edit" : "Preview"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden border border-border bg-card">
          <Textarea
            id={label}
            value={isPreviewMode ? value : displayValue}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={isPreviewMode}
            className={cn(
              "min-h-[200px] p-4 font-mono text-sm leading-relaxed",
              isPreviewMode 
                ? 'bg-muted/50 cursor-not-allowed' 
                : 'bg-card focus:bg-muted/30',
              "whitespace-pre-wrap border-0 resize-y",
              "text-foreground placeholder-muted-foreground",
              "focus:ring-1 focus:ring-border",
              "transition-colors duration-200"
            )}
            spellCheck={false}
            placeholder="Enter your prompt here..."
          />
        </div>
      </div>
    </Card>
  );
}