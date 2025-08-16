import { create } from 'zustand';
import { ValuationInput, ValuationResult } from '@/types/valuation';

interface ValuationStore {
  input: Partial<ValuationInput>;
  result: ValuationResult | null;
  currentStep: number;
  setInput: (input: Partial<ValuationInput>) => void;
  setResult: (result: ValuationResult) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

export const useValuationStore = create<ValuationStore>((set) => ({
  input: {},
  result: null,
  currentStep: 1,
  setInput: (input) => set((state) => ({ input: { ...state.input, ...input } })),
  setResult: (result) => set({ result }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set({ input: {}, result: null, currentStep: 1 }),
}));