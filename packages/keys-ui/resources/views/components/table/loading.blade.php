@props(['computedLoadingClasses', 'computedTextClasses'])

<tr>
    <td {{ $attributes->merge(['colspan' => $colspan, 'class' => 'px-6 py-4 bg-surface']) }}>
        <div class="{{ $computedLoadingClasses }}">
            <div class="flex flex-col items-center">
                <x-keys::loading
                    animation="{{ $animation }}"
                    size="{{ $getLoadingIconSize() }}"
                    class="text-brand"
                />

                @if($text)
                    <p class="{{ $computedTextClasses }}">
                        {{ $text }}
                    </p>
                @endif

                {{ $slot }}
            </div>
        </div>
    </td>
</tr>