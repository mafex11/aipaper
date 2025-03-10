"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

const Editor = () => {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Highlight,
    ],
    content: "<p>Type your text here...</p>",
  });

  if (!editor) return null;

  const modifyText = async () => {
    const selection = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to, "\n").trim();

    if (!selectedText) {
      setOutput("Please select some text to modify.");
      return;
    }
    if (!prompt) {
      setOutput("Please enter a prompt (e.g., 'make this friendly').");
      return;
    }

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek:deepseek-r1-zero", // Replace with "mistral-7b-instruct" if needed
          messages: [
            {
              role: "user",
              content: `Rewrite the following text to be ${prompt}: "${selectedText}"`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Writing Cursor",
          },
        }
      );

      let modifiedText = response.data.choices[0].message.content;
      // Remove LaTeX boxing if present
      modifiedText = modifiedText.replace(/\\boxed\{(.*?)\}/g, "$1").trim();
      setOutput(modifiedText);
    } catch (error) {
      console.error("Error modifying text:", error.response?.data || error.message);
      setOutput("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 border rounded-lg shadow-md grid grid-cols-2 gap-4">
      {/* Left Section: Input Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Input</h3>
        <div className="flex flex-wrap gap-2">
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </Toggle>
          <Toggle
            pressed={editor.isActive("underline")}
            onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </Toggle>
          <Toggle
            pressed={editor.isActive("highlight")}
            onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          >
            <span className="bg-yellow-200">H</span>
          </Toggle>
          <Button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
            H1
          </Button>
          <Button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}>
            H2
          </Button>
          <Button onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}>
            H3
          </Button>
        </div>
        <EditorContent
          editor={editor}
          className="prose min-h-[300px] p-4 border rounded-md"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Enter prompt (e.g., 'make this professional')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={modifyText}>Modify</Button>
        </div>
      </div>

      {/* Right Section: Output */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Output</h3>
        <div className="min-h-[300px] p-4 border rounded-md bg-gray-50 whitespace-pre-wrap">
          {output || "Select text and enter a prompt to see the modified result here."}
        </div>
      </div>
    </div>
  );
};

export default Editor;