<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Editor extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public string $placeholder = 'Start typing...',
        public string $height = '200px',
        public bool $disabled = false,
        public array $toolbar = [],
        public string $size = 'md'
    ) {
        // Default toolbar if none provided
        if (empty($this->toolbar)) {
            $this->toolbar = [
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'h1', 'h2', 'h3', 'paragraph', '|',
                'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|',
                'insertUnorderedList', 'insertOrderedList', '|',
                'createLink', 'blockquote', '|',
                'undo', 'redo', 'removeFormat'
            ];
        }

        // Generate unique ID if not provided
        if (!$this->id) {
            $this->id = 'editor-' . uniqid();
        }

        // Validate size
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }
    }

    public function getToolbarData(): array
    {
        $toolbarConfig = [
            'bold' => [
                'command' => 'bold',
                'icon' => 'heroicon-o-bold',
                'title' => 'Bold',
                'type' => 'toggle'
            ],
            'italic' => [
                'command' => 'italic',
                'icon' => 'heroicon-o-italic',
                'title' => 'Italic',
                'type' => 'toggle'
            ],
            'underline' => [
                'command' => 'underline',
                'icon' => 'heroicon-o-underline',
                'title' => 'Underline',
                'type' => 'toggle'
            ],
            'strikethrough' => [
                'command' => 'strikeThrough',
                'icon' => 'heroicon-o-strikethrough',
                'title' => 'Strikethrough',
                'type' => 'toggle'
            ],
            'h1' => [
                'command' => 'formatBlock',
                'value' => 'h1',
                'icon' => 'heroicon-o-h1',
                'title' => 'Heading 1',
                'type' => 'button'
            ],
            'h2' => [
                'command' => 'formatBlock',
                'value' => 'h2',
                'icon' => 'heroicon-o-h2',
                'title' => 'Heading 2',
                'type' => 'button'
            ],
            'h3' => [
                'command' => 'formatBlock',
                'value' => 'h3',
                'icon' => 'heroicon-o-h3',
                'title' => 'Heading 3',
                'type' => 'button'
            ],
            'paragraph' => [
                'command' => 'formatBlock',
                'value' => 'p',
                'icon' => 'heroicon-o-bars-3-bottom-left',
                'title' => 'Paragraph',
                'type' => 'button'
            ],
            'alignLeft' => [
                'command' => 'justifyLeft',
                'icon' => 'heroicon-o-bars-3-bottom-left',
                'title' => 'Align Left',
                'type' => 'button'
            ],
            'alignCenter' => [
                'command' => 'justifyCenter',
                'icon' => 'heroicon-o-bars-3',
                'title' => 'Align Center',
                'type' => 'button'
            ],
            'alignRight' => [
                'command' => 'justifyRight',
                'icon' => 'heroicon-o-bars-3-bottom-right',
                'title' => 'Align Right',
                'type' => 'button'
            ],
            'alignJustify' => [
                'command' => 'justifyFull',
                'icon' => 'heroicon-o-bars-4',
                'title' => 'Justify',
                'type' => 'button'
            ],
            'insertUnorderedList' => [
                'command' => 'insertUnorderedList',
                'icon' => 'heroicon-o-list-bullet',
                'title' => 'Bullet List',
                'type' => 'toggle'
            ],
            'insertOrderedList' => [
                'command' => 'insertOrderedList',
                'icon' => 'heroicon-o-numbered-list',
                'title' => 'Numbered List',
                'type' => 'toggle'
            ],
            'createLink' => [
                'command' => 'createLink',
                'icon' => 'heroicon-o-link',
                'title' => 'Insert Link',
                'type' => 'button'
            ],
            'blockquote' => [
                'command' => 'formatBlock',
                'value' => 'blockquote',
                'icon' => 'heroicon-o-chat-bubble-left-right',
                'title' => 'Blockquote',
                'type' => 'button'
            ],
            'undo' => [
                'command' => 'undo',
                'icon' => 'heroicon-o-arrow-uturn-left',
                'title' => 'Undo',
                'type' => 'button'
            ],
            'redo' => [
                'command' => 'redo',
                'icon' => 'heroicon-o-arrow-uturn-right',
                'title' => 'Redo',
                'type' => 'button'
            ],
            'removeFormat' => [
                'command' => 'removeFormat',
                'icon' => 'heroicon-o-x-mark',
                'title' => 'Clear Formatting',
                'type' => 'button'
            ]
        ];

        $processedToolbar = [];
        foreach ($this->toolbar as $item) {
            if ($item === '|') {
                $processedToolbar[] = ['type' => 'separator'];
            } elseif (isset($toolbarConfig[$item])) {
                $processedToolbar[] = $toolbarConfig[$item];
            }
        }

        return $processedToolbar;
    }

    public function getEditorClasses(): string
    {
        $baseClasses = 'w-full border border-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent prose prose-sm max-w-none';

        if ($this->disabled) {
            $baseClasses .= ' bg-neutral-50 cursor-not-allowed opacity-50';
        } else {
            $baseClasses .= ' bg-background';
        }

        return $baseClasses;
    }

    public function getToolbarClasses(): string
    {
        return 'flex flex-wrap items-center gap-1 p-2 border-b border-border bg-neutral-50/50';
    }

    public function getContainerClasses(): string
    {
        $baseClasses = 'border border-border rounded-md overflow-hidden bg-background';

        if ($this->disabled) {
            $baseClasses .= ' opacity-50';
        }

        return $baseClasses;
    }

    public function getButtonSize(): string
    {
        return match ($this->size) {
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'sm',
            default => 'sm'
        };
    }

    public function render()
    {
        return view('keys::components.editor', [
            'toolbarData' => $this->getToolbarData(),
            'editorClasses' => $this->getEditorClasses(),
            'toolbarClasses' => $this->getToolbarClasses(),
            'containerClasses' => $this->getContainerClasses(),
            'buttonSize' => $this->getButtonSize()
        ]);
    }
}