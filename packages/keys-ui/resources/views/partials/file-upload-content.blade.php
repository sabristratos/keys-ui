
<input
    type="file"
    class="file-input"
    @if($name) name="{{ $name }}" @endif
    id="{{ $id }}"
    accept="{{ $accept }}"
    @if($required) required @endif
    @if($disabled) disabled @endif
    {{ $attributes->merge($computedWireAttributes) }}
/>

<div class="upload-empty-state text-center transition-all duration-300 ease-in-out">
    <x-keys::icon
        name="heroicon-o-cloud-arrow-up"
        :size="$size === 'sm' ? 'lg' : 'xl'"
        class="mx-auto text-muted mb-3"
    />

    <div class="space-y-1">
        <x-keys::text element="p" size="sm" weight="medium" color="text">
            {{ $placeholder }}
        </x-keys::text>

        @if($accept !== '*' || $maxSize)
            <x-keys::text element="p" size="xs" color="muted">
                @if($accept !== '*')
                    @php
                        $acceptedTypes = explode(',', $accept);
                        $displayTypes = array_map(fn($type) => strtoupper(str_replace(['image/', 'application/', '.'], '', trim($type))), $acceptedTypes);
                    @endphp
                    {{ implode(', ', $displayTypes) }}
                    @if($maxSize) • @endif
                @endif
                @if($maxSize)
                    Max {{ $maxSize }}
                @endif
            </x-keys::text>
        @endif
    </div>

    <div class="mt-4">
        <x-keys::button
            variant="outline"
            size="sm"
            type="button"
            tabindex="-1"
        >
            @if($shouldShowLivewireContent)
                <span wire:loading.remove wire:target="{{ $name }}">Choose File</span>
                <span wire:loading wire:target="{{ $name }}">Uploading...</span>
            @else
                Choose File
            @endif
        </x-keys::button>
    </div>
</div>

<div class="upload-file-state hidden transition-all duration-300 ease-in-out p-4">
    <div class="flex items-center justify-center">
        <div class="flex items-center space-x-4">
            
            <div class="flex-shrink-0">
                <img class="file-preview-image hidden w-20 h-20 object-cover rounded-lg border-2 border-border" alt="" />
                <div class="file-icon flex items-center justify-center w-20 h-20 bg-surface border-2 border-border rounded-lg">
                    <x-keys::icon name="heroicon-o-document" size="lg" class="text-muted" />
                </div>
            </div>


            <div class="flex-1 min-w-0">
                <div class="file-name text-sm font-medium text-text truncate"></div>
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
    </div>

    
    <div class="upload-progress hidden mt-4 w-full bg-surface rounded-full overflow-hidden h-1.5">
        <div class="upload-progress-bar bg-brand h-full transition-all duration-300 ease-out" style="width: 0%"></div>
    </div>
</div>

<div class="error-message hidden mt-4 text-sm text-danger"></div>