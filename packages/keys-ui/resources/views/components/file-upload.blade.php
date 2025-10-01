@php

    $dropzoneBaseClasses = 'relative border-2 border-dashed rounded-lg transition-all duration-200';

    $sizeClasses = match ($size) {
        'sm' => 'p-4',
        'md' => 'p-6',
        'lg' => 'p-8',
        default => 'p-6'
    };

    $dropzoneStateClasses = match (true) {
        $disabled => 'border-neutral bg-surface cursor-not-allowed opacity-50',
        $hasError() => 'border-danger bg-danger/5 hover:border-danger-hover cursor-pointer',
        default => 'border-border bg-surface hover:border-brand hover:bg-brand/5 has-[:focus-visible]:border-brand has-[:focus-visible]:bg-brand/5 cursor-pointer'
    };

    $dropzoneClasses = "$dropzoneBaseClasses $sizeClasses $dropzoneStateClasses";

    $filePreviewClasses = 'hidden p-4 rounded-lg border-2 border-border bg-surface transition-all duration-300 ease-in-out';
@endphp

<div @if($isShorthand()) class="space-y-2" @endif>
    @if($isShorthand())
        <x-keys::label :for="$id" :required="$required" :optional="$optional">{{ $label }}</x-keys::label>
    @endif

    
    <div class="file-upload-wrapper">
        <div class="relative" {{ $attributes->merge($dataAttributes) }} @if($isLivewireMode()) wire:ignore @endif>
        
        <input
            type="file"
            class="file-input"
            @if($name) name="{{ $name }}{{ $multiple ? '[]' : '' }}" @endif
            id="{{ $id }}"
            accept="{{ $accept }}"
            @if($required) required @endif
            @if($disabled) disabled @endif
            @if($multiple) multiple @endif
            {{ $attributes->merge($computedWireAttributes) }}
        />

        
        <div class="{{ $dropzoneClasses }} upload-empty-state text-center transition-all duration-300 ease-in-out">
            <x-keys::icon
                name="heroicon-o-cloud-arrow-up"
                :size="$iconSize"
                class="mx-auto text-muted mb-3"
            />

            <div class="space-y-1">
                <p class="text-sm font-medium text-foreground">
                    {{ $placeholder }}
                </p>

                @if($formattedAcceptedTypes || $maxSize)
                    <p class="text-xs text-muted">
                        @if($formattedAcceptedTypes)
                            {{ $formattedAcceptedTypes }}
                            @if($maxSize) • @endif
                        @endif
                        @if($maxSize)
                            Max {{ $maxSize }}
                        @endif
                    </p>
                @endif
            </div>
        </div>
        </div>

        
        <div class="upload-file-state {{ $filePreviewClasses }} @container">
            
            <div class="file-summary hidden mb-4 flex items-center justify-between">
                <div class="text-sm font-medium text-foreground">
                    <span class="file-count">0</span> file(s) selected
                </div>
                <div class="file-total-size text-sm text-muted"></div>
            </div>

            
            <div class="single-file-preview">
                <div class="flex items-center space-x-4">
                    
                    <div class="flex-shrink-0">
                        <img class="file-preview-image hidden w-20 h-20 object-cover rounded-lg border-2 border-border" alt="" />
                        <div class="file-icon flex items-center justify-center w-20 h-20 bg-surface border-2 border-border rounded-lg">
                            <x-keys::icon name="heroicon-o-document" size="lg" />
                        </div>
                    </div>

                    
                    <div class="flex-1 min-w-0">
                        <div class="file-name text-sm font-medium text-foreground truncate"></div>
                        <div class="file-size text-xs text-muted mt-1"></div>

                        
                        <div class="flex items-center space-x-2 mt-3">
                            <x-keys::button
                                variant="outline"
                                size="xs"
                                type="button"
                                class="file-change-btn transition-all duration-200 ease-in-out"
                                aria-label="Change selected file"
                            >
                                Change file
                            </x-keys::button>

                            <button type="button" class="file-remove text-xs text-danger hover:text-danger-hover font-medium transition-all duration-200 ease-in-out" aria-label="Remove selected file">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                
                <div class="upload-progress hidden mt-4 w-full bg-surface rounded-full overflow-hidden h-1.5">
                    <div class="upload-progress-bar bg-brand h-full transition-all duration-300 ease-out" style="width: 0%"></div>
                </div>
            </div>

            
            <div class="multiple-files-preview hidden grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-3">
                
            </div>

            
            <div class="add-more-files hidden mt-4">
                <x-keys::button
                    variant="outline"
                    size="sm"
                    type="button"
                    class="file-add-more-btn w-full"
                    icon="heroicon-o-plus"
                >
                    Add more files
                </x-keys::button>
            </div>
        </div>

        
        <div class="error-message hidden mt-4 text-sm text-danger"></div>
    </div>

    @if($isShorthand() && $showErrors)
        <x-keys::error :errors="$errors" />
    @endif
</div>

