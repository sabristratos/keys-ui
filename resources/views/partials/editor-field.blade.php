<div {{ $editorContainerAttributes }}>
    
    <div
        id="{{ $liveRegionId }}"
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
        data-quill-live-region="true"
    ></div>

    
    <div
        class="{{ $containerClasses }}"
        id="{{ $editorId }}"
        data-quill-container="true"
        style="min-height: {{ $editorHeight }}"
        data-quill-config="{{ json_encode($quillConfig) }}"
        data-quill-value="{{ $value }}"
        {!! $editorAccessibilityAttrs !!}
        tabindex="0"
    ></div>

    
    @if($loading)
        <div class="loading-container">
            <div class="flex items-center space-x-2 text-muted">
                <x-keys::loading :animation="$loadingAnimation" :size="$size" />
                <span class="text-sm">{{ $loadingText }}</span>
            </div>
        </div>
    @endif

    
    @if($name)
        <input
            type="hidden"
            id="{{ $hiddenInputId }}"
            name="{{ $name }}"
            value="{{ $value }}"
            data-quill-input="true"
            @if($required) required @endif
        />
    @endif
</div>