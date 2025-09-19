<div {{ $editorContainerAttributes }}>
    {{-- ARIA Live Region for Screen Reader Announcements --}}
    <div
        id="{{ $liveRegionId }}"
        aria-live="polite"
        aria-atomic="true"
        class="sr-only"
        data-quill-live-region="true"
    ></div>

    {{-- Quill Editor Container --}}
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

    {{-- Loading Indicator --}}
    @if($loading)
        <div class="loading-container">
            <div class="flex items-center space-x-2 text-muted">
                <x-keys::loading :animation="$loadingAnimation" :size="$size" />
                <span class="text-sm">{{ $loadingText }}</span>
            </div>
        </div>
    @endif

    {{-- Hidden Input for Form Submission --}}
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