@php
    $dropzoneBaseClasses = 'relative border-2 border-dashed rounded-lg transition-all duration-200';
    $sizeClasses = match ($size) {
        'sm' => 'p-4',
        'md' => 'p-6',
        'lg' => 'p-8',
        default => 'p-6'
    };
    $dropzoneStateClasses = match (true) {
        $disabled => 'border-neutral bg-elevation-1 cursor-not-allowed opacity-50',
        $hasErrors() => 'border-danger bg-danger/5 hover:border-danger-hover cursor-pointer',
        default => 'border-line bg-elevation-1 hover:border-accent hover:bg-accent/5 has-[:focus-visible]:border-accent has-[:focus-visible]:bg-accent/5 cursor-pointer'
    };
    $dropzoneClasses = "$dropzoneBaseClasses $sizeClasses $dropzoneStateClasses";
    $filePreviewClasses = 'hidden p-4 rounded-lg border-2 border-line bg-elevation-1 transition-all duration-300 ease-in-out';
@endphp

<div @if($isShorthand()) class="space-y-2" @endif>
    @if($isShorthand())
        <x-keys::label :for="$id" :required="$required" :optional="$optional">{{ $label }}</x-keys::label>
    @endif

    <div {{ $attributes->merge($dataAttributes)->class('file-upload-wrapper group transition-all duration-200 [&.dragover]:border-accent [&.dragover]:bg-accent/10 [&.dragover]:scale-[1.02]') }}>
        <div class="relative">
            <div class="{{ $dropzoneClasses }} text-center" data-file-upload-empty-state @if($isLivewireMode()) wire:ignore @endif>
                <div class="transition-transform duration-200 group-[.dragover]:scale-105">
                    <x-keys::icon name="cloud-arrow-up" :size="$iconSize" class="mx-auto text-muted mb-3" />
                    <div class="space-y-1">
                        <x-keys::text element="p" size="sm" weight="medium" color="text">
                            {{ $placeholder ?: __('keys-ui::keys-ui.file_upload.drag_drop_files') }}
                        </x-keys::text>
                        @if($formattedAcceptedTypes || $maxSize)
                            <x-keys::text element="p" size="xs" color="muted">
                                @if($formattedAcceptedTypes){{ $formattedAcceptedTypes }}@if($maxSize) • @endif @endif
                                @if($maxSize){{ __('keys-ui::keys-ui.file_upload.max_file_size') }} {{ $maxSize }}@endif
                            </x-keys::text>
                        @endif
                    </div>
                </div>
            </div>
            <input
                type="file"
                class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                data-file-input
                @if($name) name="{{ $name }}{{ $multiple ? '[]' : '' }}" @endif
                id="{{ $id }}"
                accept="{{ $accept }}"
                @if($required) required @endif
                @if($disabled) disabled @endif
                @if($multiple) multiple @endif
                {{ $attributes->merge($computedWireAttributes) }}
            />
        </div>

        <div class="upload-file-state {{ $filePreviewClasses }}" data-file-upload-preview-state @if($isLivewireMode()) wire:ignore @endif>
            <div class="hidden mb-4 flex items-center justify-between" data-file-summary>
                <x-keys::text element="div" size="sm" weight="medium" color="text">
                    <span data-file-count>0</span> {{ __('keys-ui::keys-ui.file_upload.files_selected', ['count' => '']) }}
                </x-keys::text>
                <div class="text-sm text-muted" data-file-total-size></div>
            </div>

            <div data-single-file-preview>
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                        <x-keys::image src="" alt="" class="file-preview-image hidden w-20 h-20" data-file-preview-image />
                        <div class="file-icon flex items-center justify-center w-20 h-20 bg-elevation-1 border-2 border-line rounded-lg" data-file-icon>
                            <x-keys::icon name="heroicon-o-document" size="lg" />
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <x-keys::text weight="medium" class="file-name truncate" data-file-name></x-keys::text>
                        <x-keys::text size="xs" color="muted" class="mt-1" data-file-size></x-keys::text>
                        <div class="flex items-center space-x-2 mt-3">
                            <x-keys::button
                                variant="outline"
                                size="xs"
                                type="button"
                                class="transition-all duration-200 ease-in-out"
                                aria-label="{{ __('keys-ui::keys-ui.file_upload.change_file') }}"
                                data-file-change-btn
                            >
                                {{ __('keys-ui::keys-ui.file_upload.change_file') }}
                            </x-keys::button>
                            <x-keys::button
                                variant="ghost"
                                color="danger"
                                size="xs"
                                type="button"
                                aria-label="{{ __('keys-ui::keys-ui.file_upload.remove_file') }}"
                                data-file-remove
                            >
                                {{ __('keys-ui::keys-ui.file_upload.remove_file') }}
                            </x-keys::button>
                        </div>
                    </div>
                </div>
                <div class="upload-progress hidden mt-4">
                    <x-keys::progress size="xs" color="brand" :value="0" :show-value="false" :show-percentage="false" data-upload-progress />
                </div>
            </div>

            <div class="hidden grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3
                        [&_.file-card:hover_.file-preview-thumbnail]:scale-105
                        [&_.file-card.upload-success]:border-success [&_.file-card.upload-success]:bg-success/5
                        [&_.file-card.upload-error]:border-danger [&_.file-card.upload-error]:bg-danger/5
                        [&_.file-card.uploading]:border-accent [&_.file-card.uploading]:bg-accent/5"
                 data-multiple-files-preview>
            </div>

            <div class="hidden mt-4" data-add-more-files-container>
                <x-keys::button variant="outline" size="sm" type="button" class="w-full" icon="heroicon-o-plus" data-add-more-files-btn>
                    {{ __('keys-ui::keys-ui.file_upload.add_more_files') }}
                </x-keys::button>
            </div>
        </div>
    </div>

    <template data-file-card-template>
        <x-keys::card variant="filled" class="file-card relative group" padding="md" data-file-index>
            <div class="file-preview-thumbnail mb-2 relative transition-transform duration-200">
                <x-keys::image src="" alt="" class="hidden w-full h-24" data-file-card-image />
                <div class="flex items-center justify-center w-full h-24 bg-elevation-1 border border-line rounded" data-file-card-icon>
                    <x-keys::icon name="document" size="lg" />
                </div>
            </div>
            <div class="space-y-1">
                <x-keys::text weight="medium" class="truncate" data-file-card-name></x-keys::text>
                <x-keys::text size="xs" color="muted" data-file-card-size></x-keys::text>
            </div>
            <x-keys::button
                variant="solid"
                color="danger"
                size="xs"
                icon="x-mark"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                data-remove-file
            />
        </x-keys::card>
    </template>

    @if($isShorthand() && $showErrors)
        <x-keys::error :errors="$errors" />
    @endif
</div>
