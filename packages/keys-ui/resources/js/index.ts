/**
 * Keys UI - JavaScript/TypeScript exports
 *
 * This file exports all the interactive functionality for Keys UI components.
 * Import individual classes or use the default initialization.
 */

import { FormActions } from './FormActions';
import { AlertActions } from './AlertActions';
import { RadioActions } from './RadioActions';
import { SelectActions } from './SelectActions';
import { TabsActions } from './TabsActions';
import { ModalActions } from './ModalActions';
import { ToastActions } from './ToastActions';
import { DropdownActions } from './DropdownActions';
import { TableActions } from './TableActions';

export { FormActions, AlertActions, RadioActions, SelectActions, TabsActions, ModalActions, ToastActions, DropdownActions, TableActions };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    FormActions.getInstance().init();

    AlertActions.getInstance().init();

    RadioActions.getInstance().init();

    SelectActions.getInstance().init();

    TabsActions.getInstance().init();

    ModalActions.getInstance().init();

    ToastActions.getInstance().init();

    DropdownActions.getInstance().init();

    TableActions.getInstance().init();

}

/**
 * Default export for convenience
 */
export default {
    FormActions: FormActions.getInstance(),
    AlertActions: AlertActions.getInstance(),
    RadioActions: RadioActions.getInstance(),
    SelectActions: SelectActions.getInstance(),
    TabsActions: TabsActions.getInstance(),
    ModalActions: ModalActions.getInstance(),
    ToastActions: ToastActions.getInstance(),
    DropdownActions: DropdownActions.getInstance(),
    TableActions: TableActions.getInstance(),
    init: initializeKeysUI
};
