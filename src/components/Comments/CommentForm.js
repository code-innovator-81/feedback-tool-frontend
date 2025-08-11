import React, { useState, forwardRef, useImperativeHandle } from 'react';

const CommentForm = forwardRef(({ onSubmit, isSubmitting, currentUser }, ref) => {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setContent('');
      setShowPreview(false);
      setError('');
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.trim().length < 3) {
      setError('Comment must be at least 3 characters long');
      return;
    }

    if (content.trim().length > 500) {
      setError('Comment must not exceed 500 characters');
      return;
    }

    setError('');
    onSubmit(content);
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) {
      setError('');
    }
  };

  const insertFormatting = (format) => {
    const textarea = document.getElementById('comment-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    let cursorOffset = 0;

    switch (format) {
      case 'bold':
        if (selectedText) {
          newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
          cursorOffset = start + selectedText.length + 4;
        } else {
          newText = content.substring(0, start) + '**bold text**' + content.substring(end);
          cursorOffset = start + 2;
        }
        break;
      case 'italic':
        if (selectedText) {
          newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
          cursorOffset = start + selectedText.length + 2;
        } else {
          newText = content.substring(0, start) + '*italic text*' + content.substring(end);
          cursorOffset = start + 1;
        }
        break;
      case 'code':
        if (selectedText) {
          newText = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
          cursorOffset = start + selectedText.length + 2;
        } else {
          newText = content.substring(0, start) + '`code`' + content.substring(end);
          cursorOffset = start + 1;
        }
        break;
      default:
        return;
    }

    setContent(newText);
    
    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorOffset, cursorOffset);
    }, 0);
  };

  const formatPreview = (text) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  const processMentions = (text) => {
    // Simple @ mention processing - in a real app, this would integrate with user search
    return text.replace(/@(\w+)/g, '<span class="text-indigo-600 font-medium">@$1</span>');
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Formatting Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => insertFormatting('bold')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Bold (Ctrl+B)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 4a1 1 0 011-1h3a3 3 0 110 6H6v2h3a3 3 0 110 6H6a1 1 0 01-1-1V4zm2 2v3h2a1 1 0 100-2H7zm0 5v3h2a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('italic')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Italic (Ctrl+I)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 1a1 1 0 011 1v1h2a1 1 0 110 2h-.586l-2 8H10a1 1 0 110 2H6a1 1 0 110-2h.586l2-8H7a1 1 0 010-2h1V2a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('code')}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
              title="Code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265L11.396 8l1.553 3.684a1 1 0 11-1.898.632L9.683 8l1.368-4.316a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L4.414 9l1.293 1.293a1 1 0 11-1.414 1.414L2.586 10a2 2 0 010-2.828l1.707-1.707a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l1.707 1.707a2 2 0 010 2.828L15.707 12.707a1 1 0 11-1.414-1.414L15.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} class="comment-form bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {showPreview ? (
          <div className="p-3 min-h-[120px] prose prose-sm max-w-none">
            {content.trim() ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: processMentions(formatPreview(content)) 
                }}
              />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview...</p>
            )}
          </div>
        ) : (
          <textarea
            id="comment-textarea"
            value={content}
            onChange={handleChange}
            placeholder="Write your comment... You can use **bold**, *italic*, `code`, and @mentions"
            rows={4}
            maxLength={500}
            className="w-full p-3 border-0 resize-none focus:outline-none focus:ring-0"
          />
        )}

        {error && (
          <div className="px-3 pb-2">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-500">
              {content.length}/500 characters
            </span>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Tip:</span> Use @ to mention users (e.g., @john)
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isSubmitting || !content.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </form>
    </div>
  );
});

CommentForm.displayName = 'CommentForm';

export default CommentForm;