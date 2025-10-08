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
import { SelectActions } from './SelectActions';
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
import { CountdownActions } from './CountdownActions';
import { FileUploadActions} from "@/FileUploadActions";
import './TabsActions';

import Quill from 'quill';


import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';
import { RTLUtils } from './utils/RTLUtils';
import { LivewireUtils } from './utils/LivewireUtils';

import polyfill from '@oddbird/css-anchor-positioning/fn';

export { FileUploadActions, FormActions, TextareaActions, AlertActions, AvatarActions, BadgeActions, BadgeGroupActions, ButtonActions, CalendarCore, RadioActions, RangeActions, SelectActions, ModalActions, ToastActions, DropdownActions, TableActions, TimePickerActions, EditorActions, DatePickerActions, AddToCartActions, GalleryActions, PopoverActions, ImageActions, LightboxActions, ChartActions, ColorPickerActions, SidebarActions, CountdownActions };

export { BaseActionClass, DOMUtils, EventUtils, RTLUtils, LivewireUtils };

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

    FileUploadActions.getInstance().init();

    AvatarActions.getInstance().init();

    BadgeActions.getInstance().init();

    BadgeGroupActions.getInstance().init();

    ButtonActions.getInstance().init();

    CalendarCore.getInstance().init();

    RadioActions.getInstance().init();

    RangeActions.getInstance().init();

    SelectActions.getInstance().init();

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

    PopoverActions.getInstance().init();

    ColorPickerActions.getInstance().init();

    SidebarActions.getInstance().init();

    CountdownActions.getInstance().init();

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
    PopoverActions: PopoverActions.getInstance(),
    SidebarActions: SidebarActions.getInstance(),
    CountdownActions: CountdownActions.getInstance(),
    FileUploadActions: FileUploadActions.getInstance(),
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
