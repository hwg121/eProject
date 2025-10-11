import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Quote, Link, Image, AlignLeft, AlignCenter, AlignRight,
  Heading1, Heading2, Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDarkMode?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter content...',
  isDarkMode = false,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      // Always update the content when value changes
      // This ensures HTML formatting is preserved when editing

      // Only update if the content is different to avoid cursor position issues
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Ensure content is saved when editor loses focus
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const formatHeading = (level: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (selectedText) {
          // Wrap selected text in heading tag
          const headingElement = document.createElement(level);
          headingElement.textContent = selectedText;
          range.deleteContents();
          range.insertNode(headingElement);
        } else {
          // Insert heading at cursor position
          const headingElement = document.createElement(level);
          headingElement.textContent = 'Heading';
          range.insertNode(headingElement);
          // Move cursor after the heading
          const newRange = document.createRange();
          newRange.setStartAfter(headingElement);
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
        handleInput();
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const toolbarButtonClass = `p-2 rounded transition-colors ${
    isDarkMode
      ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
  }`;

  const editorClass = `w-full min-h-[200px] p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
    isDarkMode
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  } ${className}`;

  return (
    <div className="space-y-3">
      <style>{`
        .rich-text-editor h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.2;
        }
        .rich-text-editor h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.8rem 0 0.4rem 0;
          line-height: 1.3;
        }
        .rich-text-editor h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.6rem 0 0.3rem 0;
          line-height: 1.4;
        }
        .rich-text-editor p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        .rich-text-editor ul, .rich-text-editor ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .rich-text-editor blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
      `}</style>
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-wrap gap-1 p-3 border rounded-lg ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        {/* Text Formatting */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className={toolbarButtonClass}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className={toolbarButtonClass}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className={toolbarButtonClass}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Headings */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => formatHeading('h1')}
            className={toolbarButtonClass}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatHeading('h2')}
            className={toolbarButtonClass}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => formatHeading('h3')}
            className={toolbarButtonClass}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Lists */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className={toolbarButtonClass}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className={toolbarButtonClass}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Alignment */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className={toolbarButtonClass}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className={toolbarButtonClass}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className={toolbarButtonClass}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Media */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={insertLink}
            className={toolbarButtonClass}
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className={toolbarButtonClass}
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('formatBlock', 'blockquote')}
            className={toolbarButtonClass}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={`rich-text-editor ${editorClass} ${
          isFocused ? 'ring-2 ring-emerald-500' : ''
        }`}
        style={{
          direction: 'ltr',
          textAlign: 'left'
        }}
        dir="ltr"
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default RichTextEditor;
