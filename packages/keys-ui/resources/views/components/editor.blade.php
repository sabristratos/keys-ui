@php
    $containerId = $id . '-container';
    $editorId = $id . '-editor';
    $hiddenInputId = $id . '-input';

    $containerAttributes = $attributes->merge([
        'class' => $containerClasses
    ])->merge([
        'data-editor' => 'true',
        'data-editor-id' => $id
    ]);
@endphp

<div {{ $containerAttributes }}>
    {{-- Toolbar --}}
    <div class="{{ $toolbarClasses }}">
        @php $groupItems = []; @endphp

        @foreach($toolbarData as $index => $item)
            @if($item['type'] === 'separator')
                {{-- Render current group if it has items --}}
                @if(!empty($groupItems))
                    <x-keys::button.group variant="outline" size="{{ $buttonSize }}" attached>
                        @foreach($groupItems as $groupItem)
                            @if($groupItem['type'] === 'toggle')
                                <x-keys::button
                                    variant="ghost"
                                    size="{{ $buttonSize }}"
                                    :icon="$groupItem['icon']"
                                    title="{{ $groupItem['title'] }}"
                                    data-editor-command="{{ $groupItem['command'] }}"
                                    data-editor-value="{{ $groupItem['value'] ?? '' }}"
                                    data-editor-toggle="true"
                                />
                            @else
                                <x-keys::button
                                    variant="ghost"
                                    size="{{ $buttonSize }}"
                                    :icon="$groupItem['icon']"
                                    title="{{ $groupItem['title'] }}"
                                    data-editor-command="{{ $groupItem['command'] }}"
                                    data-editor-value="{{ $groupItem['value'] ?? '' }}"
                                />
                            @endif
                        @endforeach
                    </x-keys::button.group>
                    @php $groupItems = []; @endphp
                @endif

                {{-- Add separator --}}
                <div class="w-px h-6 bg-border mx-1"></div>
            @else
                {{-- Add item to current group --}}
                @php $groupItems[] = $item; @endphp
            @endif

            {{-- Render last group if we're at the end --}}
            @if($loop->last && !empty($groupItems))
                <x-keys::button.group variant="outline" size="{{ $buttonSize }}" attached>
                    @foreach($groupItems as $groupItem)
                        @if($groupItem['type'] === 'toggle')
                            <x-keys::button
                                variant="ghost"
                                size="{{ $buttonSize }}"
                                :icon="$groupItem['icon']"
                                title="{{ $groupItem['title'] }}"
                                data-editor-command="{{ $groupItem['command'] }}"
                                data-editor-value="{{ $groupItem['value'] ?? '' }}"
                                data-editor-toggle="true"
                            />
                        @else
                            <x-keys::button
                                variant="ghost"
                                size="{{ $buttonSize }}"
                                :icon="$groupItem['icon']"
                                title="{{ $groupItem['title'] }}"
                                data-editor-command="{{ $groupItem['command'] }}"
                                data-editor-value="{{ $groupItem['value'] ?? '' }}"
                            />
                        @endif
                    @endforeach
                </x-keys::button.group>
            @endif
        @endforeach
    </div>

    {{-- Editor Content Area --}}
    <div
        id="{{ $editorId }}"
        class="{{ $editorClasses }}"
        contenteditable="{{ $disabled ? 'false' : 'true' }}"
        data-placeholder="{{ $placeholder }}"
        style="min-height: {{ $height }}"
        data-editor-content="true"
    >{!! $value !!}</div>

    {{-- Hidden Input for Form Submission --}}
    @if($name)
        <input
            type="hidden"
            id="{{ $hiddenInputId }}"
            name="{{ $name }}"
            value="{{ $value }}"
            data-editor-input="true"
        />
    @endif

    {{-- Component Styles --}}
    <style>
        /* Editor specific styles */
        [data-editor="true"] [contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: rgb(156 163 175); /* text-neutral-400 */
            pointer-events: none;
        }

        [data-editor="true"] [contenteditable="true"]:focus:before {
            content: '';
        }

        /* Toolbar button active states for toggle buttons */
        [data-editor="true"] [data-editor-toggle="true"].active {
            background-color: rgb(239 246 255); /* bg-blue-50 */
            color: rgb(59 130 246); /* text-blue-600 */
            border-color: rgb(147 197 253); /* border-blue-300 */
        }

        /* Prose styles for editor content */
        [data-editor="true"] [data-editor-content="true"] h1 {
            font-size: 1.875rem;
            font-weight: 700;
            line-height: 1.2;
            margin: 0.5rem 0;
        }

        [data-editor="true"] [data-editor-content="true"] h2 {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.3;
            margin: 0.5rem 0;
        }

        [data-editor="true"] [data-editor-content="true"] h3 {
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.4;
            margin: 0.5rem 0;
        }

        [data-editor="true"] [data-editor-content="true"] p {
            margin: 0.5rem 0;
        }

        [data-editor="true"] [data-editor-content="true"] blockquote {
            border-left: 4px solid rgb(209 213 219); /* border-neutral-300 */
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: rgb(107 114 128); /* text-neutral-500 */
        }

        [data-editor="true"] [data-editor-content="true"] ul,
        [data-editor="true"] [data-editor-content="true"] ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }

        [data-editor="true"] [data-editor-content="true"] li {
            margin: 0.25rem 0;
        }

        [data-editor="true"] [data-editor-content="true"] a {
            color: rgb(59 130 246); /* text-blue-600 */
            text-decoration: underline;
        }

        [data-editor="true"] [data-editor-content="true"] a:hover {
            color: rgb(37 99 235); /* text-blue-700 */
        }

        /* Focus styles */
        [data-editor="true"] [data-editor-content="true"]:focus {
            outline: none;
        }
    </style>
</div>