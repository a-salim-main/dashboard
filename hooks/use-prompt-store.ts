import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NichePrompts } from '@/lib/supabase';
import { escapeString, unescapeString } from '@/lib/utils';

interface PromptState {
  pendingChanges: Record<string, NichePrompts>;
  originalData: Record<string, NichePrompts>;
  dirtyFields: Record<string, string[]>;
  
  // Actions
  setPendingChanges: (nicheName: string, changes: NichePrompts) => void;
  setOriginalData: (nicheName: string, data: NichePrompts) => void;
  updatePrompt: (nicheName: string, field: keyof NichePrompts, value: string) => void;
  resetField: (nicheName: string, field: keyof NichePrompts) => void;
  clearChanges: (nicheName?: string) => void;
  batchUpdate: (updates: Record<string, NichePrompts>) => void;
  hasChanges: (nicheName: string) => boolean;
  getModifiedFields: (nicheName: string) => string[];
  getPendingChanges: (nicheName: string) => NichePrompts | null;
  getOriginalValue: (nicheName: string, field: keyof NichePrompts) => string;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      pendingChanges: {},
      originalData: {},
      dirtyFields: {},

      updatePrompt: (nicheName: string, field: keyof NichePrompts, value: string) => {
        const state = get();
        const original = state.originalData[nicheName];
        if (!original) return;

        const currentChanges = state.pendingChanges[nicheName] || { ...original };
        const newChanges = { ...currentChanges, [field]: value };
        
        // Check if the value is different from original
        const isChanged = value !== original[field];
        const currentDirtyFields = new Set(state.dirtyFields[nicheName] || []);
        
        if (isChanged) {
          currentDirtyFields.add(field);
        } else {
          currentDirtyFields.delete(field);
        }

        set((state) => ({
          pendingChanges: {
            ...state.pendingChanges,
            [nicheName]: newChanges
          },
          dirtyFields: {
            ...state.dirtyFields,
            [nicheName]: Array.from(currentDirtyFields)
          }
        }));
      },

      setPendingChanges: (nicheName: string, changes: NichePrompts) => {
        const state = get();
        const original = state.originalData[nicheName] || {};
        const modifiedFields = Object.keys(changes).filter(
          field => changes[field as keyof NichePrompts] !== original[field as keyof NichePrompts]
        );

        set((state) => ({
          pendingChanges: {
            ...state.pendingChanges,
            [nicheName]: changes
          },
          dirtyFields: {
            ...state.dirtyFields,
            [nicheName]: modifiedFields
          }
        }));
      },

      setOriginalData: (nicheName: string, data: NichePrompts) =>
        set((state) => ({
          originalData: {
            ...state.originalData,
            [nicheName]: data
          }
        })),

      resetField: (nicheName: string, field: keyof NichePrompts) => {
        const state = get();
        const original = state.originalData[nicheName];
        if (!original) return;

        const currentChanges = state.pendingChanges[nicheName] || { ...original };
        const newChanges = { ...currentChanges };
        newChanges[field] = original[field];

        const newDirtyFields = state.dirtyFields[nicheName]?.filter(f => f !== field) || [];

        set((state) => ({
          pendingChanges: {
            ...state.pendingChanges,
            [nicheName]: newChanges
          },
          dirtyFields: {
            ...state.dirtyFields,
            [nicheName]: newDirtyFields
          }
        }));
      },

      clearChanges: (nicheName?: string) => {
        if (nicheName) {
          set((state) => {
            const { [nicheName]: _, ...remainingChanges } = state.pendingChanges;
            const { [nicheName]: __, ...remainingDirty } = state.dirtyFields;
            return {
              pendingChanges: remainingChanges,
              dirtyFields: remainingDirty
            };
          });
        } else {
          set({ pendingChanges: {}, dirtyFields: {} });
        }
      },

      batchUpdate: (updates: Record<string, NichePrompts>) =>
        set((state) => {
          const newPendingChanges: Record<string, NichePrompts> = { ...state.pendingChanges };
          const newDirtyFields: Record<string, string[]> = { ...state.dirtyFields };
          
          Object.entries(updates).forEach(([nicheName, changes]) => {
            const original = state.originalData[nicheName] || {} as NichePrompts;
            const modifiedFields = Object.keys(changes).filter(
              field => changes[field as keyof NichePrompts] !== original[field as keyof NichePrompts]
            );

            newPendingChanges[nicheName] = {
              ...(newPendingChanges[nicheName] || {} as NichePrompts),
              ...changes
            };
            
            newDirtyFields[nicheName] = Array.from(new Set([
              ...(newDirtyFields[nicheName] || []),
              ...modifiedFields
            ]));
          });

          return {
            pendingChanges: newPendingChanges,
            dirtyFields: newDirtyFields
          };
        }),

      hasChanges: (nicheName: string) => {
        const state = get();
        return (state.dirtyFields[nicheName]?.length ?? 0) > 0;
      },

      getModifiedFields: (nicheName: string) => {
        const state = get();
        return state.dirtyFields[nicheName] || [];
      },

      getPendingChanges: (nicheName: string) => {
        const state = get();
        return state.pendingChanges[nicheName] || null;
      },

      getOriginalValue: (nicheName: string, field: keyof NichePrompts) => {
        const state = get();
        return state.originalData[nicheName]?.[field] || '';
      }
    }),
    {
      name: 'prompt-store',
      partialize: (state) => ({
        pendingChanges: state.pendingChanges,
        dirtyFields: state.dirtyFields
      })
    }
  )
);