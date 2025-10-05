@if($hasErrors())
    @php

        $messages = $getMessages();
        $baseClasses = 'mt-1';

        $errorAttributes = $attributes->merge([
            'class' => $baseClasses
        ])->merge($dataAttributes);

        if ($id) {
            $errorAttributes = $errorAttributes->merge(['id' => $id]);
        }

        $errorAttributes = $errorAttributes->merge([
            'role' => 'alert',
            'aria-live' => 'polite'
        ]);
    @endphp

    <div {{ $errorAttributes }}>
        @if($showIcon && count($messages) === 1)
            
            <div class="flex items-center gap-1.5">
                <x-keys::icon
                    name="heroicon-o-exclamation-triangle"
                    size="xs"
                    class="text-danger mt-0.5 shrink-0"
                />
                <x-keys::text element="span" size="sm" color="danger">{{ $messages[0] }}</x-keys::text>
            </div>
        @elseif(count($messages) === 1)

            <x-keys::text element="span" size="sm" color="danger">{{ $messages[0] }}</x-keys::text>
        @else
            
            <ul class="list-disc list-inside space-y-1">
                @foreach($messages as $message)
                    <li class="flex items-center gap-1.5">
                        @if($showIcon)
                            <x-keys::icon
                                name="heroicon-o-exclamation-triangle"
                                size="xs"
                                class="text-danger mt-0.5 shrink-0"
                            />
                        @endif
                        <x-keys::text element="span" size="sm" color="danger">{{ $message }}</x-keys::text>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
@endif
