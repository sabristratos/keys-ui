/**
 * Keys UI - JavaScript/TypeScript exports
 *
 * This file exports all the interactive functionality for Keys UI components.
 * Import individual classes or use the default initialization.
 */

import { FormActions } from './FormActions';
import { AlertActions } from './AlertActions';
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
import { FileUploadActions } from './FileUploadActions';
import { GalleryActions } from './GalleryActions';

// Import utility classes for external use
import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

export { FormActions, AlertActions, CalendarActions, RadioActions, RangeActions, SelectActions, TabsActions, ModalActions, ToastActions, DropdownActions, TableActions, ButtonGroupActions, TooltipActions, TimePickerActions, AccordionActions, EditorActions, DatePickerActions, AddToCartActions, FileUploadActions, GalleryActions };

// Export utility classes for external consumption
export { BaseActionClass, DOMUtils, EventUtils };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    FormActions.getInstance().init();

    AlertActions.getInstance().init();

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

    FileUploadActions.getInstance().init();

    GalleryActions.getInstance().init();

}

/**
 * Default export for convenience
 */
export default {
    FormActions: FormActions.getInstance(),
    AlertActions: AlertActions.getInstance(),
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
    FileUploadActions: FileUploadActions.getInstance(),
    GalleryActions: GalleryActions.getInstance(),
    init: initializeKeysUI
};
