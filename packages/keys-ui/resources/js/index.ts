/**
 * Keys UI - JavaScript/TypeScript exports
 *
 * This file exports all the interactive functionality for Keys UI components.
 * Import individual classes or use the default initialization.
 */

import { FormActions } from './FormActions';
import { TextareaActions } from './TextareaActions';
import { AlertActions } from './AlertActions';
import { AvatarActions } from './AvatarActions';
import { BadgeActions } from './BadgeActions';
import { ButtonActions } from './ButtonActions';
import { CalendarCore } from './calendar/CalendarCore';
import { RadioActions } from './RadioActions';
import { RangeActions } from './RangeActions';
import { SelectActions } from './SelectActions';
import { TabsActions } from './TabsActions';
import { ModalActions } from './ModalActions';
import { ToastActions } from './ToastActions';
import { DropdownActions } from './DropdownActions';
import { TableActions } from './TableActions';
import { ButtonGroupActions } from './ButtonGroupActions';
import { TooltipActions } from './TooltipActions';
import { TimePickerActions } from './TimePickerActions';
import { EditorActions } from './EditorActions';
import { DatePickerActions } from './DatePickerActions';
import { AddToCartActions } from './AddToCartActions';
import { GalleryActions } from './GalleryActions';
import { PopoverActions } from './PopoverActions';
import './FileUploadActions';

// Import Quill to expose globally for EditorActions
import Quill from 'quill';

// Import utility classes for external use
import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';
import { RTLUtils } from './utils/RTLUtils';
import FloatingManager from './utils/FloatingManager';

// Import and initialize CSS anchor positioning polyfill
import polyfill from '@oddbird/css-anchor-positioning/fn';

export { FormActions, TextareaActions, AlertActions, AvatarActions, BadgeActions, ButtonActions, CalendarCore, RadioActions, RangeActions, SelectActions, TabsActions, ModalActions, ToastActions, DropdownActions, TableActions, ButtonGroupActions, TooltipActions, TimePickerActions, EditorActions, DatePickerActions, AddToCartActions, GalleryActions, PopoverActions };

// Export utility classes for external consumption
export { BaseActionClass, DOMUtils, EventUtils, RTLUtils, FloatingManager };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    // Initialize CSS anchor positioning polyfill if needed
    if (!("anchorName" in document.documentElement.style)) {
        polyfill();
    }

    // Initialize RTL support first
    RTLUtils.initialize();

    FormActions.getInstance().init();

    TextareaActions.getInstance().init();

    AlertActions.getInstance().init();

    AvatarActions.getInstance().init();

    BadgeActions.getInstance().init();

    ButtonActions.getInstance().init();

    CalendarCore.getInstance().init();

    RadioActions.getInstance().init();

    RangeActions.getInstance().init();

    SelectActions.getInstance().init();

    TabsActions.getInstance().init();

    ModalActions.getInstance().init();

    ToastActions.getInstance().init();

    DropdownActions.getInstance().init();

    TableActions.getInstance().init();

    ButtonGroupActions.getInstance().init();

    TooltipActions.getInstance().init();

    TimePickerActions.getInstance().init();


    EditorActions.getInstance().init();

    DatePickerActions.getInstance().init();

    AddToCartActions.getInstance().init();


    GalleryActions.getInstance().init();

    // PopoverActions initializes automatically
    new PopoverActions();

    // FileUploadActions initializes itself on DOM ready

}

/**
 * KeysUI main object - provides consistent API for both ES modules and UMD builds
 */
const KeysUI = {
    FormActions: FormActions.getInstance(),
    TextareaActions: TextareaActions.getInstance(),
    AlertActions: AlertActions.getInstance(),
    AvatarActions: AvatarActions.getInstance(),
    BadgeActions: BadgeActions.getInstance(),
    ButtonActions: ButtonActions.getInstance(),
    CalendarCore: CalendarCore.getInstance(),
    RadioActions: RadioActions.getInstance(),
    RangeActions: RangeActions.getInstance(),
    SelectActions: SelectActions.getInstance(),
    TabsActions: TabsActions.getInstance(),
    ModalActions: ModalActions.getInstance(),
    ToastActions: ToastActions.getInstance(),
    DropdownActions: DropdownActions.getInstance(),
    TableActions: TableActions.getInstance(),
    ButtonGroupActions: ButtonGroupActions.getInstance(),
    TooltipActions: TooltipActions.getInstance(),
    TimePickerActions: TimePickerActions.getInstance(),
    EditorActions: EditorActions.getInstance(),
    DatePickerActions: DatePickerActions.getInstance(),
    AddToCartActions: AddToCartActions.getInstance(),
    GalleryActions: GalleryActions.getInstance(),
    PopoverActions: new PopoverActions(),
    // Expose Quill for EditorActions to use
    Quill: Quill,
    init: initializeKeysUI,
    initialize: initializeKeysUI // Alias for consistency
};

// Export as default for ES modules
export default KeysUI;

// Also expose on window for UMD builds
if (typeof window !== 'undefined') {
    (window as any).KeysUI = KeysUI;
    // Expose Quill globally for EditorActions compatibility
    (window as any).Quill = Quill;
    // Expose manual sync method for debugging
    (window as any).manualSyncEditor = () => KeysUI.EditorActions.manualSync();

}
