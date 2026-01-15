'use client'
import React, {useEffect} from 'react';
import {EditorContent, useEditor} from '@tiptap/react';
import {StarterKit} from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {cn} from '@/lib/utils';
import {Toggle} from '@/components/ui/toggle';
import {Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo2, Undo2} from 'lucide-react';

export interface TipTapEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  autoFocus?: boolean;
}

export function ContentEditor({
                                content,
                                onChange,
                                editable = true,
                                placeholder = 'Start typing...',
                                className,
                                editorClassName,
                                autoFocus = false,
                              }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editable,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none rounded-b-md px-3 py-2 min-h-full',
          editorClassName
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined) {
      // Only update if the content from props doesn't match editor content
      const currentContent = editor.getHTML();
      if (content !== currentContent) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  return (
    <div
      className={cn(
        "flex flex-col flex-1 border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 min-h-16 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
    >
      {editor && editable && (
        <div className="flex items-center gap-1 border-b p-1 flex-wrap">
          {/* History Controls */}
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().undo().run()}
            aria-label="Undo"
            disabled={!editor.can().undo()}
          >
            <Undo2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            onPressedChange={() => editor.chain().focus().redo().run()}
            aria-label="Redo"
            disabled={!editor.can().redo()}
          >
            <Redo2 className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text Formatting */}
          <Toggle
            size="sm"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Headings */}
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 1 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 2 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Lists */}
          <Toggle
            size="sm"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet List"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            aria-label="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Blockquote */}
          <Toggle
            size="sm"
            pressed={editor.isActive('blockquote')}
            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            aria-label="Quote"
          >
            <Quote className="h-4 w-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} className="flex flex-col flex-1 min-h-[200px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent" />
    </div>
  );
}
