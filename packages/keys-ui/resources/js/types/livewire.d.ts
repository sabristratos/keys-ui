/**
 * Livewire global type declarations
 *
 * This file provides TypeScript type definitions for Livewire
 * to prevent conflicts when multiple files need to reference Livewire.
 */

declare global {
    interface Window {
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
            find: (id: string) => any;
        };
    }
}

export {};
