/**
 * EditorActions - Handles Quill.js editor initialization and form integration
 *
 * Provides functionality for:
 * - Quill.js editor initialization with custom configuration
 * - Content synchronization between Quill editor and hidden input
 * - Form integration and value management
 * - Dynamic editor creation and cleanup
 */

import 'quill/dist/quill.core.css';
import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

declare global {
    interface Window {
        Quill: any;
    }
}

interface EditorState {
    quillInstance: any;
    containerElement: HTMLElement;
    hiddenInput: HTMLInputElement | null;
    config: any;
    liveRegion: HTMLElement | null;
    lastAnnouncementTime: number;
}

/**
 * LivewireIntegration - Handles Livewire-specific functionality for Editor components
 */
class LivewireIntegration {

    /**
     * Check if Livewire is available globally
     */
    static isLivewireAvailable(): boolean {
        return typeof window !== 'undefined' && 'Livewire' in window;
    }

    /**
     * Detect if an editor element is Livewire-enabled
     */
    static isLivewireEnabled(editor: HTMLElement): boolean {
        return editor.dataset.livewireEnabled === 'true' ||
               editor.dataset.livewireMode === 'true' ||
               !!editor.dataset.wireModel ||
               !!editor.querySelector('[data-quill-input="true"][wire\\:model]');
    }

    /**
     * Get the Livewire component for an editor element
     */
    static getLivewireComponent(editor: HTMLElement): any {
        if (!this.isLivewireAvailable()) return null;

        const livewireElement = editor.closest('[wire\\:id]');
        if (!livewireElement) return null;

        return (window as any).Livewire.find(livewireElement.getAttribute('wire:id'));
    }

    /**
     * Get the wire:model property name from the editor container
     */
    static getWireModelProperty(editor: HTMLElement): string | null {
        if (editor.dataset.wireModel) {
            return editor.dataset.wireModel;
        }

        if (editor.dataset.livewireProperty) {
            return editor.dataset.livewireProperty;
        }

        for (const attr of editor.attributes) {
            if (attr.name.startsWith('wire:model')) {
                return attr.value;
            }
        }

        const hiddenInput = editor.querySelector('[data-quill-input="true"]') as HTMLElement;
        if (hiddenInput) {
            for (const attr of hiddenInput.attributes) {
                if (attr.name.startsWith('wire:model')) {
                    return attr.value;
                }
            }
        }

        return null;
    }

    /**
     * Update Livewire property value
     */
    static updateLivewireProperty(editor: HTMLElement, value: string): void {
        const component = this.getLivewireComponent(editor);
        const property = this.getWireModelProperty(editor);

        if (!component || !property) return;

        try {
            component.set(property, value);
        } catch (error) {
            console.warn('Failed to update Livewire property:', property, error);
        }
    }



    /**
     * Format value for Livewire (HTML content)
     */
    static formatValueForLivewire(value: string): string {
        return value || '';
    }

}

export class EditorActions extends BaseActionClass<EditorState> {
    /**
     * Initialize editor elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        this.processQuillEditors();
    }

    /**
     * Process all existing Quill editors on the page
     */
    private processQuillEditors(): void {
        const editors = DOMUtils.findByDataAttribute('quill-editor', 'true');
        editors.forEach(editor => this.initializeQuillEditor(editor));
    }

    /**
     * Bind event listeners - minimal for Quill integration
     */
    protected bindEventListeners(): void {
    }

    /**
     * Setup dynamic observer for new editors - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (DOMUtils.hasDataAttribute(element, 'quill-editor', 'true')) {
                        this.initializeQuillEditor(element);
                    }

                    const editors = DOMUtils.findByDataAttribute('quill-editor', 'true', element);
                    editors.forEach(editor => this.initializeQuillEditor(editor));
                }
            });
        });
    }

    /**
     * Find the hidden input for an editor
     */
    private findHiddenInput(editor: HTMLElement): HTMLInputElement | null {
        return DOMUtils.querySelector(`[data-quill-input="true"]`, editor) as HTMLInputElement;
    }


    /**
     * Initialize a single Quill editor element
     */
    private initializeQuillEditor(editor: HTMLElement): void {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeQuillEditor(editor);
            });
            return;
        }

        const editorId = DOMUtils.getDataAttribute(editor, 'editorId');
        if (!editorId) {
            console.warn('Editor missing editorId, skipping initialization');
            return;
        }

        if (this.hasState(editor)) {
            return;
        }

        const containerElement = DOMUtils.querySelector(`[data-quill-container="true"]`, editor);
        const hiddenInput = this.findHiddenInput(editor);
        const liveRegion = DOMUtils.querySelector(`[data-quill-live-region="true"]`, editor) as HTMLElement;

        if (!containerElement) {
            return;
        }

        const configData = DOMUtils.getDataAttribute(containerElement as HTMLElement, 'quillConfig');

        let initialValue = '';
        if (hiddenInput && hiddenInput.value) {
            initialValue = hiddenInput.value;
        } else {
            const dataValue = DOMUtils.getDataAttribute(containerElement as HTMLElement, 'quill-value');
            if (dataValue) {
                try {
                    initialValue = JSON.parse(dataValue);
                } catch (e) {
                    initialValue = dataValue;
                }
            }
        }

        let config: any = {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'header': [1, 2, false] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                ]
            }
        };

        if (configData) {
            try {
                const parsedConfig = JSON.parse(configData);
                config = { ...config, ...parsedConfig };
            } catch (e) {
            }
        }


        let quillInstance: any;
        try {
            if (!window.Quill) {
                console.error('Global Quill not available');
                return;
            }
            quillInstance = new window.Quill(containerElement as HTMLElement, config);
        } catch (error) {
            console.error('Quill initialization failed:', error);
            return;
        }

        if (initialValue) {
            try {
                quillInstance.clipboard.dangerouslyPasteHTML(initialValue);
            } catch (e) {
                console.warn('Failed to set initial content:', e);
                quillInstance.setText(initialValue);
            }
        }

        const isLivewireEnabled = LivewireIntegration.isLivewireEnabled(editor);

        const state: EditorState = {
            quillInstance,
            containerElement: containerElement as HTMLElement,
            hiddenInput,
            config,
            liveRegion,
            lastAnnouncementTime: 0
        };


        this.setState(editor, state);

        this.setupContentSync(state);

        this.setupAccessibilityFeatures(state);

    }

    /**
     * Set up content synchronization between Quill and Livewire
     */
    private setupContentSync(state: EditorState): void {
        const isLivewireEnabled = LivewireIntegration.isLivewireEnabled(state.containerElement);


        state.quillInstance.on('text-change', (delta: any, oldDelta: any, source: string) => {

            if (isLivewireEnabled) {
                this.syncToLivewireWithState(state);
            } else {
                this.syncQuillToInput(state);
            }
        });

        if (isLivewireEnabled) {
            this.syncToLivewireWithState(state);
        } else {
            this.syncQuillToInput(state);
        }
    }

    /**
     * Sync Quill content to hidden input and dispatch events for Livewire
     */
    private syncQuillToInput(state: EditorState): void {
        if (state.hiddenInput) {
            const newValue = state.quillInstance.root.innerHTML;
            const oldValue = state.hiddenInput.value;

            if (newValue !== oldValue) {
                state.hiddenInput.value = newValue;

                this.dispatchLivewireInputEvent(state.hiddenInput, newValue);
            }
        }
    }

    /**
     * Dispatch proper input events for Livewire integration
     */
    private dispatchLivewireInputEvent(input: HTMLInputElement, value: string): void {
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: value
        });
        input.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        input.dispatchEvent(changeEvent);
    }

    /**
     * Get editor content as HTML
     */
    public getEditorContent(editor: HTMLElement): string {
        const state = this.getState(editor);
        return state ? state.quillInstance.root.innerHTML : '';
    }

    /**
     * Set editor content
     */
    public setEditorContent(editor: HTMLElement, content: string): void {
        const state = this.getState(editor);
        if (!state) return;

        try {
            state.quillInstance.clipboard.dangerouslyPasteHTML(content);
        } catch (e) {
            console.warn('Failed to set editor content:', e);
            state.quillInstance.setText(content);
        }
        this.syncQuillToInput(state);
    }

    /**
     * Clear editor content
     */
    public clearEditor(editor: HTMLElement): void {
        const state = this.getState(editor);
        if (!state) return;

        state.quillInstance.setText('');
        this.syncQuillToInput(state);
    }

    /**
     * Focus specific editor
     */
    public focusEditor(editor: HTMLElement): void {
        const state = this.getState(editor);
        if (state) {
            state.quillInstance.focus();
        }
    }

    /**
     * Get Quill instance for advanced usage
     */
    public getQuillInstance(editor: HTMLElement): any | null {
        const state = this.getState(editor);
        return state ? state.quillInstance : null;
    }

    /**
     * Set up accessibility features for the editor
     */
    private setupAccessibilityFeatures(state: EditorState): void {
        this.setupKeyboardNavigation(state);

        this.setupContentAnnouncements(state);

        this.setupToolbarAccessibility(state);
    }

    /**
     * Set up keyboard navigation enhancements
     */
    private setupKeyboardNavigation(state: EditorState): void {
        state.quillInstance.keyboard.addBinding({
            key: 'F1',
            handler: () => {
                this.announceKeyboardHelp(state);
                return false;
            }
        });

        state.containerElement.addEventListener('focus', () => {
            if (state.liveRegion) {
                this.announceToLiveRegion(state, 'Rich text editor focused. Press F1 for keyboard shortcuts.');
            }
        });
    }

    /**
     * Set up content change announcements for screen readers
     */
    private setupContentAnnouncements(state: EditorState): void {
        let typingTimer: number | null = null;
        const typingDelay = 2000;

        state.quillInstance.on('text-change', (delta: any, oldDelta: any, source: string) => {
            if (source === 'user') {
                if (typingTimer) {
                    clearTimeout(typingTimer);
                }

                typingTimer = window.setTimeout(() => {
                    const text = state.quillInstance.getText().trim();
                    const wordCount = text ? text.split(/\s+/).length : 0;

                    if (wordCount > 0) {
                        this.announceToLiveRegion(state, `${wordCount} words written`);
                    }
                }, typingDelay);
            }
        });

        state.quillInstance.on('selection-change', (range: any, oldRange: any, source: string) => {
            if (range && source === 'user') {
                const formats = state.quillInstance.getFormat(range);
                this.announceFormattingChanges(state, formats);
            }
        });
    }

    /**
     * Set up toolbar accessibility enhancements
     */
    private setupToolbarAccessibility(state: EditorState): void {
        const toolbar = state.containerElement.querySelector('.ql-toolbar');
        if (!toolbar) return;

        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Rich text editor toolbar');

        const buttons = toolbar.querySelectorAll('button');
        buttons.forEach((button, index) => {
            this.enhanceButtonAccessibility(button as HTMLButtonElement);

            button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        toolbar.addEventListener('keydown', (e) => {
            this.handleToolbarKeyboard(e as KeyboardEvent, buttons);
        });
    }

    /**
     * Enhance individual button accessibility
     */
    private enhanceButtonAccessibility(button: HTMLButtonElement): void {
        const buttonLabels: Record<string, string> = {
            'ql-bold': 'Bold',
            'ql-italic': 'Italic',
            'ql-underline': 'Underline',
            'ql-strike': 'Strikethrough',
            'ql-link': 'Insert link',
            'ql-clean': 'Remove formatting',
            'ql-list[value="ordered"]': 'Numbered list',
            'ql-list[value="bullet"]': 'Bullet list',
            'ql-header[value="1"]': 'Heading 1',
            'ql-header[value="2"]': 'Heading 2'
        };

        for (const [className, label] of Object.entries(buttonLabels)) {
            if (button.classList.contains(className.split('[')[0]) ||
                button.matches(`[${className.split('[')[1]}`)) {
                button.setAttribute('aria-label', label);
                button.setAttribute('title', label);
                break;
            }
        }
    }

    /**
     * Handle toolbar keyboard navigation
     */
    private handleToolbarKeyboard(e: KeyboardEvent, buttons: NodeListOf<Element>): void {
        const currentIndex = Array.from(buttons).findIndex(btn => btn === document.activeElement);

        if (currentIndex === -1) return;

        let nextIndex = currentIndex;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                e.preventDefault();
                break;
            case 'Home':
                nextIndex = 0;
                e.preventDefault();
                break;
            case 'End':
                nextIndex = buttons.length - 1;
                e.preventDefault();
                break;
            default:
                return;
        }

        buttons[currentIndex].setAttribute('tabindex', '-1');
        buttons[nextIndex].setAttribute('tabindex', '0');
        (buttons[nextIndex] as HTMLElement).focus();
    }

    /**
     * Announce text to the live region
     */
    private announceToLiveRegion(state: EditorState, message: string): void {
        if (!state.liveRegion) return;

        const now = Date.now();
        if (now - state.lastAnnouncementTime < 1000) return;

        state.liveRegion.textContent = message;
        state.lastAnnouncementTime = now;

        setTimeout(() => {
            if (state.liveRegion) {
                state.liveRegion.textContent = '';
            }
        }, 3000);
    }

    /**
     * Announce formatting changes
     */
    private announceFormattingChanges(state: EditorState, formats: any): void {
        const activeFormats = Object.keys(formats).filter(key => formats[key]);

        if (activeFormats.length > 0) {
            const formatNames = activeFormats.map(format => {
                switch (format) {
                    case 'bold': return 'bold';
                    case 'italic': return 'italic';
                    case 'underline': return 'underlined';
                    case 'strike': return 'strikethrough';
                    case 'header': return `heading ${formats[format]}`;
                    case 'list': return `${formats[format]} list`;
                    default: return format;
                }
            });

            this.announceToLiveRegion(state, `Formatting: ${formatNames.join(', ')}`);
        }
    }

    /**
     * Announce keyboard shortcuts help
     */
    private announceKeyboardHelp(state: EditorState): void {
        const helpText = 'Keyboard shortcuts: Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+K for link. Use arrow keys to navigate toolbar buttons.';
        this.announceToLiveRegion(state, helpText);
    }






    /**
     * Synchronize content from Quill to Livewire using provided state
     */
    private syncToLivewireWithState(state: EditorState): void {
        const quillContent = state.quillInstance.root.innerHTML;
        const formattedValue = LivewireIntegration.formatValueForLivewire(quillContent);


        LivewireIntegration.updateLivewireProperty(state.containerElement, formattedValue);
    }

    /**
     * Reinitialize editor after DOM morphing
     */
    private reinitializeAfterMorph(editor: HTMLElement): void {
        const containerElement = DOMUtils.querySelector(`[data-quill-container="true"]`, editor);
        if (containerElement && !this.hasState(editor)) {
            this.initializeQuillEditor(editor);
        }
    }

    /**
     * Manually trigger content sync to Livewire (for debugging)
     */
    public manualSync(): void {
        const editorContainers = DOMUtils.querySelectorAll('[data-quill-container="true"]');

        editorContainers.forEach((container: HTMLElement) => {
            if (LivewireIntegration.isLivewireEnabled(container)) {
                const quill = window.Quill.find(container);
                if (quill) {
                    const content = quill.root.innerHTML;
                    const formattedValue = LivewireIntegration.formatValueForLivewire(content);


                    LivewireIntegration.updateLivewireProperty(container, formattedValue);
                }
            }
        });
    }

    /**
     * Clean up EditorActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        this.stateManager.forEach((state) => {
            state.quillInstance.off('text-change');
        });
    }
}

export default EditorActions.getInstance();