/**
 * EditorActions - Handles Quill.js editor initialization and form integration
 *
 * Provides functionality for:
 * - Quill.js editor initialization with custom configuration
 * - Content synchronization between Quill editor and hidden input
 * - Form integration and value management
 * - Dynamic editor creation and cleanup
 */

import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

interface EditorState {
    quillInstance: Quill;
    containerElement: HTMLElement;
    hiddenInput: HTMLInputElement | null;
    config: any;
    liveRegion: HTMLElement | null;
    lastAnnouncementTime: number;
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
        // Quill handles most events internally, minimal setup needed
    }

    /**
     * Setup dynamic observer for new editors - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a Quill editor
                    if (DOMUtils.hasDataAttribute(element, 'quill-editor', 'true')) {
                        this.initializeQuillEditor(element);
                    }

                    // Check for Quill editors within the added node
                    const editors = DOMUtils.findByDataAttribute('quill-editor', 'true', element);
                    editors.forEach(editor => this.initializeQuillEditor(editor));
                }
            });
        });
    }

    /**
     * Initialize a single Quill editor element
     */
    private initializeQuillEditor(editor: HTMLElement): void {
        console.log('EditorActions: Initializing Quill editor', editor);

        const editorId = DOMUtils.getDataAttribute(editor, 'editorId');
        if (!editorId) {
            console.warn('EditorActions: No editor-id found');
            return;
        }

        const containerElement = DOMUtils.querySelector(`[data-quill-container="true"]`, editor);
        const hiddenInput = DOMUtils.querySelector(`[data-quill-input="true"]`, editor) as HTMLInputElement;
        const liveRegion = DOMUtils.querySelector(`[data-quill-live-region="true"]`, editor) as HTMLElement;

        if (!containerElement) {
            console.warn('EditorActions: No Quill container element found');
            return;
        }

        // Get configuration from data attribute
        const configData = DOMUtils.getDataAttribute(containerElement as HTMLElement, 'quillConfig');
        const initialValue = DOMUtils.getDataAttribute(containerElement as HTMLElement, 'quillValue');

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
                console.warn('EditorActions: Invalid Quill config JSON', e);
                console.warn('EditorActions: Using default config');
            }
        }

        console.log('EditorActions: Final Quill config', config);
        console.log('EditorActions: Container element', containerElement);

        // Initialize Quill instance
        let quillInstance: Quill;
        try {
            quillInstance = new Quill(containerElement as HTMLElement, config);
            console.log('EditorActions: Quill instance created successfully', quillInstance);
        } catch (error) {
            console.error('EditorActions: Failed to create Quill instance', error);
            return;
        }

        // Set initial content if provided
        if (initialValue) {
            try {
                // Try to parse as HTML first
                quillInstance.root.innerHTML = initialValue;
            } catch (e) {
                console.warn('EditorActions: Error setting initial value', e);
            }
        }

        const state: EditorState = {
            quillInstance,
            containerElement: containerElement as HTMLElement,
            hiddenInput,
            config,
            liveRegion,
            lastAnnouncementTime: 0
        };

        this.setState(editor, state);

        // Set up content change listener for form synchronization
        this.setupContentSync(state);

        // Set up accessibility features
        this.setupAccessibilityFeatures(state);

        console.log('EditorActions: Quill editor initialized successfully');
    }

    /**
     * Set up content synchronization between Quill and hidden input
     */
    private setupContentSync(state: EditorState): void {
        // Listen to Quill text-change events
        state.quillInstance.on('text-change', () => {
            this.syncQuillToInput(state);
        });

        // Initial sync
        this.syncQuillToInput(state);
    }

    /**
     * Sync Quill content to hidden input
     */
    private syncQuillToInput(state: EditorState): void {
        if (state.hiddenInput) {
            // Get HTML content from Quill
            state.hiddenInput.value = state.quillInstance.root.innerHTML;
        }
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

        state.quillInstance.root.innerHTML = content;
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
    public getQuillInstance(editor: HTMLElement): Quill | null {
        const state = this.getState(editor);
        return state ? state.quillInstance : null;
    }

    /**
     * Set up accessibility features for the editor
     */
    private setupAccessibilityFeatures(state: EditorState): void {
        // Add keyboard navigation enhancements
        this.setupKeyboardNavigation(state);

        // Set up content change announcements
        this.setupContentAnnouncements(state);

        // Add toolbar accessibility enhancements
        this.setupToolbarAccessibility(state);
    }

    /**
     * Set up keyboard navigation enhancements
     */
    private setupKeyboardNavigation(state: EditorState): void {
        // Add keyboard shortcuts information
        state.quillInstance.keyboard.addBinding({
            key: 'F1',
            handler: () => {
                this.announceKeyboardHelp(state);
                return false;
            }
        });

        // Enhance focus management
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
        const typingDelay = 2000; // 2 second delay after typing stops

        state.quillInstance.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                // Clear previous timer
                if (typingTimer) {
                    clearTimeout(typingTimer);
                }

                // Set new timer for announcement
                typingTimer = window.setTimeout(() => {
                    const text = state.quillInstance.getText().trim();
                    const wordCount = text ? text.split(/\s+/).length : 0;

                    if (wordCount > 0) {
                        this.announceToLiveRegion(state, `${wordCount} words written`);
                    }
                }, typingDelay);
            }
        });

        // Announce formatting changes
        state.quillInstance.on('selection-change', (range, oldRange, source) => {
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

        // Add toolbar accessibility attributes
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Rich text editor toolbar');

        // Enhance button accessibility
        const buttons = toolbar.querySelectorAll('button');
        buttons.forEach((button, index) => {
            // Add accessible names based on Quill button classes
            this.enhanceButtonAccessibility(button as HTMLButtonElement);

            // Add tabindex management for roving tabindex pattern
            button.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        // Add keyboard navigation for toolbar
        toolbar.addEventListener('keydown', (e) => {
            this.handleToolbarKeyboard(e, buttons);
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

        // Find matching label
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

        // Update tabindex and focus
        buttons[currentIndex].setAttribute('tabindex', '-1');
        buttons[nextIndex].setAttribute('tabindex', '0');
        (buttons[nextIndex] as HTMLElement).focus();
    }

    /**
     * Announce text to the live region
     */
    private announceToLiveRegion(state: EditorState, message: string): void {
        if (!state.liveRegion) return;

        // Throttle announcements to avoid overwhelming screen readers
        const now = Date.now();
        if (now - state.lastAnnouncementTime < 1000) return;

        state.liveRegion.textContent = message;
        state.lastAnnouncementTime = now;

        // Clear message after a delay to allow for new announcements
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
     * Clean up EditorActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Clean up Quill instances
        this.stateManager.forEach((state) => {
            // Quill doesn't have a destroy method, but we can remove event listeners
            state.quillInstance.off('text-change');
        });
    }
}

export default EditorActions.getInstance();