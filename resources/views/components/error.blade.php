@if($hasErrors())
    @php
        $messages = $getMessages();
        $errorAttributes = $attributes->merge([
            'class' => $baseClasses()
        ]);
    @endphp

    <div {{ $errorAttributes }}>
        @if($showIcon && count($messages) === 1)
            <div class="flex items-start gap-1">
                <x-keys::icon name="exclamation-triangle" size="xs" class="text-danger mt-0.5 shrink-0" />
                <span>{{ $messages[0] }}</span>
            </div>
        @elseif(count($messages) === 1)
            <span>{{ $messages[0] }}</span>
        @else
            <ul class="list-disc list-inside space-y-1">
                @foreach($messages as $message)
                    <li class="flex items-start gap-1">
                        @if($showIcon)
                            <x-keys::icon name="exclamation-triangle" size="xs" class="text-danger mt-0.5 shrink-0" />
                        @endif
                        <span>{{ $message }}</span>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
@endif