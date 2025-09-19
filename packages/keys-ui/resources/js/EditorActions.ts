/**
 * EditorActions - Handles editor functionality and toolbar interactions
 *
 * Provides functionality for:
 * - Toolbar button event handling with delegation
 * - Document editing commands (bold, italic, lists, etc.)
 * - Content synchronization between contenteditable and hidden input
 * - Toggle state management for formatting buttons
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface EditorState {
    contentElement: HTMLElement;
    hiddenInput: HTMLInputElement | null;
    toolbarButtons: HTMLButtonElement[];
    isActive: boolean;
}

export class EditorActions extends BaseActionClass<EditorState> {
    /**
     * Initialize editor elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        this.processEditors();
    }

    /**
     * Process all existing editors on the page
     */
    private processEditors(): void {
        const editors = DOMUtils.findByDataAttribute('editor', 'true');
        editors.forEach(editor => this.initializeEditor(editor));
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Handle toolbar button clicks
        EventUtils.handleDelegatedClick(
            '[data-editor-command]',
            (button, event) => this.handleToolbarClick(button, event)
        );

        // Handle content changes to sync with hidden input
        EventUtils.handleDelegatedInput(
            '[data-editor-content="true"]',
            (element, event) => this.handleContentChange(element as HTMLElement, event)
        );

        // Handle selection changes to update button states
        EventUtils.addEventListener(document, 'selectionchange', () => {
            this.updateToolbarStates();
        });

        // Handle focus/blur to manage editor state
        EventUtils.handleDelegatedFocus(
            '[data-editor-content="true"]',
            (element, event) => this.handleEditorFocus(element, event)
        );
    }

    /**
     * Setup dynamic observer for new editors - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is an editor
                    if (DOMUtils.hasDataAttribute(element, 'editor', 'true')) {
                        this.initializeEditor(element);
                    }

                    // Check for editors within the added node
                    const editors = DOMUtils.findByDataAttribute('editor', 'true', element);
                    editors.forEach(editor => this.initializeEditor(editor));
                }
            });
        });
    }

    /**
     * Initialize a single editor element
     */
    private initializeEditor(editor: HTMLElement): void {
        const editorId = DOMUtils.getDataAttribute(editor, 'editor-id');
        if (!editorId) return;

        const contentElement = DOMUtils.querySelector(`[data-editor-content="true"]`, editor);
        const hiddenInput = DOMUtils.querySelector(`[data-editor-input="true"]`, editor) as HTMLInputElement;
        const toolbarButtons = DOMUtils.querySelectorAll('[data-editor-command]', editor) as HTMLButtonElement[];

        if (!contentElement) return;

        const state: EditorState = {
            contentElement: contentElement as HTMLElement,
            hiddenInput,
            toolbarButtons,
            isActive: false
        };

        this.setState(editor, state);

        // Initialize content if hidden input has value
        if (hiddenInput && hiddenInput.value && !contentElement.innerHTML.trim()) {
            contentElement.innerHTML = hiddenInput.value;
        }
    }

    /**
     * Handle toolbar button clicks
     */
    private handleToolbarClick(button: HTMLButtonElement, event: MouseEvent): void {
        event.preventDefault();

        const command = DOMUtils.getDataAttribute(button, 'editor-command');
        const value = DOMUtils.getDataAttribute(button, 'editor-value');
        const isToggle = DOMUtils.hasDataAttribute(button, 'editor-toggle', 'true');

        if (!command) return;

        const editor = DOMUtils.findClosest(button, '[data-editor="true"]');
        if (!editor) return;

        const state = this.getState(editor);
        if (!state) return;

        // Focus the content area
        DOMUtils.focus(state.contentElement);

        // Handle special commands
        if (command === 'createLink') {
            this.handleCreateLink();
        } else {
            // Execute document command
            if (value) {
                document.execCommand(command, false, value);
            } else {
                document.execCommand(command, false);
            }
        }

        // Update toolbar states
        this.updateToolbarStates();

        // Sync content with hidden input
        this.syncContentToInput(state);
    }

    /**
     * Handle content changes in the editor
     */
    private handleContentChange(element: HTMLElement, event: InputEvent): void {
        const editor = DOMUtils.findClosest(element, '[data-editor="true"]');
        if (!editor) return;

        const state = this.getState(editor);
        if (!state) return;

        // Sync content to hidden input
        this.syncContentToInput(state);

        // Update toolbar states after content change
        setTimeout(() => this.updateToolbarStates(), 10);
    }

    /**
     * Handle editor focus
     */
    private handleEditorFocus(element: HTMLElement, event: FocusEvent): void {
        const editor = DOMUtils.findClosest(element, '[data-editor="true"]');
        if (!editor) return;

        const state = this.getState(editor);
        if (!state) return;

        state.isActive = true;
        this.updateToolbarStates();
    }

    /**
     * Sync contenteditable content to hidden input
     */
    private syncContentToInput(state: EditorState): void {
        if (state.hiddenInput) {
            state.hiddenInput.value = state.contentElement.innerHTML;
        }
    }

    /**
     * Update toolbar button states based on current selection
     */
    private updateToolbarStates(): void {
        // Get all active editors
        this.stateManager.forEach((state, editor) => {
            if (!state.isActive) return;

            state.toolbarButtons.forEach(button => {
                const command = DOMUtils.getDataAttribute(button, 'editor-command');
                const isToggle = DOMUtils.hasDataAttribute(button, 'editor-toggle', 'true');

                if (!command || !isToggle) return;

                try {
                    const isActive = document.queryCommandState(command);
                    DOMUtils.toggleClass(button, 'active', isActive);
                } catch (e) {
                    // Some commands might not be supported, ignore errors
                }
            });
        });
    }

    /**
     * Handle link creation with user input
     */
    private handleCreateLink(): void {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const selectedText = selection.toString();
        const url = prompt('Enter URL:', selectedText.startsWith('http') ? selectedText : 'https://');

        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    /**
     * Get editor content as HTML
     */
    public getEditorContent(editor: HTMLElement): string {
        const state = this.getState(editor);
        return state ? state.contentElement.innerHTML : '';
    }

    /**
     * Set editor content
     */
    public setEditorContent(editor: HTMLElement, content: string): void {
        const state = this.getState(editor);
        if (!state) return;

        state.contentElement.innerHTML = content;
        this.syncContentToInput(state);
    }

    /**
     * Clear editor content
     */
    public clearEditor(editor: HTMLElement): void {
        this.setEditorContent(editor, '');
    }

    /**
     * Focus specific editor
     */
    public focusEditor(editor: HTMLElement): void {
        const state = this.getState(editor);
        if (state) {
            DOMUtils.focus(state.contentElement);
            state.isActive = true;
        }
    }

    /**
     * Check if editor is focused/active
     */
    public isEditorActive(editor: HTMLElement): boolean {
        const state = this.getState(editor);
        return state ? state.isActive : false;
    }

    /**
     * Execute command on specific editor
     */
    public execCommand(editor: HTMLElement, command: string, value?: string): void {
        const state = this.getState(editor);
        if (!state) return;

        DOMUtils.focus(state.contentElement);

        if (value) {
            document.execCommand(command, false, value);
        } else {
            document.execCommand(command, false);
        }

        this.updateToolbarStates();
        this.syncContentToInput(state);
    }

    /**
     * Clean up EditorActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Clear all editor states
        this.stateManager.forEach((state) => {
            state.isActive = false;
        });
    }
}

export default EditorActions.getInstance();