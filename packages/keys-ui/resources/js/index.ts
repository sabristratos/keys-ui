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
import { ModalActions } from './ModalActions';
import { ToastActions } from './ToastActions';
import { DropdownActions } from './DropdownActions';

// Export classes for individual use
export { FormActions, AlertActions, RadioActions, SelectActions, ModalActions, ToastActions, DropdownActions };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    // Initialize FormActions
    FormActions.getInstance().init();

    // Initialize AlertActions
    AlertActions.getInstance().init();

    // Initialize RadioActions
    RadioActions.getInstance().init();

    // Initialize SelectActions
    SelectActions.getInstance().init();

    // Initialize ModalActions
    ModalActions.getInstance().init();

    // Initialize ToastActions
    ToastActions.getInstance().discoverToasts();

    // Initialize DropdownActions
    DropdownActions.getInstance().init();

    console.log('Keys UI initialized');
}

/**
 * Default export for convenience
 */
export default {
    FormActions: FormActions.getInstance(),
    AlertActions: AlertActions.getInstance(),
    RadioActions: RadioActions.getInstance(),
    SelectActions: SelectActions.getInstance(),
    ModalActions: ModalActions.getInstance(),
    ToastActions: ToastActions.getInstance(),
    DropdownActions: DropdownActions.getInstance(),
    init: initializeKeysUI
};