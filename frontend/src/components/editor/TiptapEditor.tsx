import { useEffect } from "react";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Image from "@tiptap/extension-image";

import Link from "@tiptap/extension-link";

import TextAlign from "@tiptap/extension-text-align";

type Props = {
  value: string;
  onChange: (value: string) => void;
  uploadImage?: (file: File) => Promise<string>;
};

export function TiptapEditor({ value, onChange, uploadImage }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),

      Image.configure({
        inline: false,
      }),

      Link.configure({
        openOnClick: false,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !uploadImage) {
      return;
    }

    const url = await uploadImage(file);

    console.log("IMAGEM TIPTAP URL:", url);

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
      })
      .run();
  }

  function addLink() {
    const url = window.prompt("Digite o link:");

    if (!url) {
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();
  }

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Lista
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          Título
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ↔
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          →
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          ☰
        </button>

        <button type="button" onClick={addLink}>
          🔗 Link
        </button>

        <label className="tiptap-button">
          🖼 Imagem
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </button>
      </div>
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
