/**
 * Keys UI - JavaScript/TypeScript exports
 *
 * This file exports all the interactive functionality for Keys UI components.
 * Import individual classes or use the default initialization.
 */

import { FormActions } from './FormActions';
import { AlertActions } from './AlertActions';
import { BadgeActions } from './BadgeActions';
import { CalendarActions } from './CalendarActions';
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
import { AccordionActions } from './AccordionActions';
import { EditorActions } from './EditorActions';
import { DatePickerActions } from './DatePickerActions';
import { AddToCartActions } from './AddToCartActions';
import { GalleryActions } from './GalleryActions';
import { PopoverActions } from './PopoverActions';

// Import Quill to expose globally for EditorActions
import Quill from 'quill';

// Import utility classes for external use
import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';
import { RTLUtils } from './utils/RTLUtils';
import FloatingManager from './utils/FloatingManager';

export { FormActions, AlertActions, BadgeActions, CalendarActions, RadioActions, RangeActions, SelectActions, TabsActions, ModalActions, ToastActions, DropdownActions, TableActions, ButtonGroupActions, TooltipActions, TimePickerActions, AccordionActions, EditorActions, DatePickerActions, AddToCartActions, GalleryActions, PopoverActions };

// Export utility classes for external consumption
export { BaseActionClass, DOMUtils, EventUtils, RTLUtils, FloatingManager };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    // Initialize RTL support first
    RTLUtils.initialize();

    FormActions.getInstance().init();

    AlertActions.getInstance().init();

    BadgeActions.getInstance().init();

    CalendarActions.getInstance().init();

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

    AccordionActions.getInstance().init();

    EditorActions.getInstance().init();

    DatePickerActions.getInstance().init();

    AddToCartActions.getInstance().init();


    GalleryActions.getInstance().init();

    PopoverActions.getInstance().init();

}

/**
 * KeysUI main object - provides consistent API for both ES modules and UMD builds
 */
const KeysUI = {
    FormActions: FormActions.getInstance(),
    AlertActions: AlertActions.getInstance(),
    BadgeActions: BadgeActions.getInstance(),
    CalendarActions: CalendarActions.getInstance(),
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
    AccordionActions: AccordionActions.getInstance(),
    EditorActions: EditorActions.getInstance(),
    DatePickerActions: DatePickerActions.getInstance(),
    AddToCartActions: AddToCartActions.getInstance(),
    GalleryActions: GalleryActions.getInstance(),
    PopoverActions: PopoverActions.getInstance(),
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
