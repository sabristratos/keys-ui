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
import { BadgeGroupActions } from './BadgeGroupActions';
import { ButtonActions } from './ButtonActions';
import { CalendarCore } from './calendar/CalendarCore';
import { RadioActions } from './RadioActions';
import { RangeActions } from './RangeActions';
import { RatingActions } from './RatingActions';
import { SelectActions } from './SelectActions';
import { TabsActions } from './TabsActions';
import { ModalActions } from './ModalActions';
import { ToastActions } from './ToastActions';
import { DropdownActions } from './DropdownActions';
import { TableActions } from './TableActions';
import { TimePickerActions } from './TimePickerActions';
import { EditorActions } from './EditorActions';
import { DatePickerActions } from './DatePickerActions';
import { AddToCartActions } from './AddToCartActions';
import { GalleryActions } from './GalleryActions';
import { PopoverActions } from './PopoverActions';
import { ImageActions } from './ImageActions';
import { LightboxActions } from './LightboxActions';
import { ChartActions } from './ChartActions';
import ColorPickerActions from './ColorPickerActions';
import { SidebarActions } from './SidebarActions';
import './FileUploadActions';

import Quill from 'quill';


import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';
import { RTLUtils } from './utils/RTLUtils';

import polyfill from '@oddbird/css-anchor-positioning/fn';

export { FormActions, TextareaActions, AlertActions, AvatarActions, BadgeActions, BadgeGroupActions, ButtonActions, CalendarCore, RadioActions, RangeActions, RatingActions, SelectActions, TabsActions, ModalActions, ToastActions, DropdownActions, TableActions, TimePickerActions, EditorActions, DatePickerActions, AddToCartActions, GalleryActions, PopoverActions, ImageActions, LightboxActions, ChartActions, ColorPickerActions, SidebarActions };

export { BaseActionClass, DOMUtils, EventUtils, RTLUtils };

/**
 * Initialize all Keys UI components
 * Call this function to automatically set up all interactive functionality
 */
export function initializeKeysUI(): void {
    console.log('[Keys UI] Starting initialization...');

    if (!("anchorName" in document.documentElement.style)) {
        polyfill();
    }

    RTLUtils.initialize();

    FormActions.getInstance().init();

    TextareaActions.getInstance().init();

    AlertActions.getInstance().init();

    AvatarActions.getInstance().init();

    BadgeActions.getInstance().init();

    BadgeGroupActions.getInstance().init();

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

    TimePickerActions.getInstance().init();


    EditorActions.getInstance().init();

    DatePickerActions.getInstance().init();

    AddToCartActions.getInstance().init();


    GalleryActions.getInstance().init();

    ImageActions.getInstance().init();

    console.log('[Keys UI] Initializing LightboxActions...');
    LightboxActions.getInstance().init();

    ChartActions.getInstance().init();

    new PopoverActions();

    console.log('[Keys UI] Initializing ColorPickerActions...');
    document.querySelectorAll('[data-keys-color-picker]').forEach((element) => {
        new ColorPickerActions(element as HTMLElement);
    });

    console.log('[Keys UI] Initializing SidebarActions...');
    const sidebarActions = new SidebarActions();
    sidebarActions.init();

    console.log('[Keys UI] Initialization complete!');
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
    BadgeGroupActions: BadgeGroupActions.getInstance(),
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
    TimePickerActions: TimePickerActions.getInstance(),
    EditorActions: EditorActions.getInstance(),
    DatePickerActions: DatePickerActions.getInstance(),
    AddToCartActions: AddToCartActions.getInstance(),
    GalleryActions: GalleryActions.getInstance(),
    ImageActions: ImageActions.getInstance(),
    LightboxActions: LightboxActions.getInstance(),
    ChartActions: ChartActions.getInstance(),
    PopoverActions: new PopoverActions(),
    SidebarActions: SidebarActions,
    Quill: Quill,
    init: initializeKeysUI,
    initialize: initializeKeysUI
};

export default KeysUI;

if (typeof window !== 'undefined') {
    (window as any).KeysUI = KeysUI;
    (window as any).Quill = Quill;
    (window as any).manualSyncEditor = () => KeysUI.EditorActions.manualSync();

}
