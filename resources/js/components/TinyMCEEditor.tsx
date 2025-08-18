import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

interface FilePickerMeta {
    filetype: string;
    fieldname: string;
}

interface FilePickerCallback {
    (url: string, meta?: { title?: string; alt?: string }): void;
}

// Extend Window interface for TinyMCE
declare global {
    interface Window {
        tinymce: {
            activeEditor: {
                editorUpload: {
                    blobCache: {
                        create: (id: string, file: File, base64: string) => any;
                        add: (blobInfo: any) => void;
                    };
                };
            };
        };
    }
}

export default function TinyMCEEditor({
    value,
    onChange,
    height = 500,
    placeholder = "Mulai menulis konten chapter...",
    disabled = false,
    className = ""
}: TinyMCEEditorProps) {
    
    const handleEditorChange = (content: string) => {
        onChange(content);
    };

    return (
        <div className={`tinymce-editor-wrapper ${className}`}>
            <div className="border border-gray-200 dark:border-neutral-600 rounded-lg overflow-hidden bg-white dark:bg-neutral-800">
                <Editor
                    apiKey="oattv8sl5q2cvwa5h945hofhsdhji9fl0qbjrkbodntneiaw"
                    value={value}
                    onEditorChange={handleEditorChange}
                    disabled={disabled}
                init={{
                    height: height,
                    menubar: 'edit view format table tools help',
                    placeholder: placeholder,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'help', 
                        'wordcount', 'emoticons', 'codesample', 'quickbars', 'autosave'
                    ],
                    toolbar_mode: 'sliding',
                    toolbar: [
                        // Baris 1: Format dasar dan teks
                        'undo redo | formatselect | bold italic underline strikethrough | forecolor backcolor',
                        // Baris 2: Alignment dan lists  
                        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                        // Baris 3: Media dan tools
                        'link image media table | codesample emoticons | removeformat',
                        // Baris 4: Advanced tools
                        'searchreplace visualblocks code preview fullscreen | wordcount help'
                    ].join(' | '),
                    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                    quickbars_insert_toolbar: 'quickimage quicktable',
                    contextmenu: 'link image table',
                    
                    // Format options
                    block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6; Preformatted=pre; Blockquote=blockquote',
                    font_family_formats: 'Inter=Inter,system-ui,sans-serif; Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; Georgia=georgia,palatino,serif; Helvetica=helvetica,arial,sans-serif; Times New Roman=times new roman,times,serif; Trebuchet MS=trebuchet ms,geneva,sans-serif; Verdana=verdana,geneva,sans-serif',
                    
                    // Content styling dengan dark mode support
                    content_style: `
                        body { 
                            font-family: 'Inter', 'system-ui', '-apple-system', sans-serif; 
                            font-size: 16px; 
                            line-height: 1.7;
                            color: #374151;
                            max-width: 100%;
                            margin: 0;
                            padding: 20px;
                            background-color: #ffffff;
                        }
                        
                        /* Headings */
                        h1, h2, h3, h4, h5, h6 { 
                            color: #111827; 
                            margin-top: 2em;
                            margin-bottom: 0.75em;
                            font-weight: 600;
                            line-height: 1.25;
                        }
                        h1 { font-size: 2.5em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
                        h2 { font-size: 2em; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.25em; }
                        h3 { font-size: 1.75em; }
                        h4 { font-size: 1.5em; }
                        h5 { font-size: 1.25em; }
                        h6 { font-size: 1.1em; color: #6b7280; }
                        
                        /* Paragraphs */
                        p { 
                            margin-bottom: 1.25em; 
                            text-align: justify;
                        }
                        p:last-child { margin-bottom: 0; }
                        
                        /* Blockquotes */
                        blockquote { 
                            border-left: 4px solid #3b82f6; 
                            padding: 1rem 1.5rem; 
                            margin: 2em 0;
                            background-color: #f8fafc;
                            border-radius: 0 0.5rem 0.5rem 0;
                            font-style: italic;
                            color: #475569;
                            position: relative;
                        }
                        blockquote:before {
                            content: '"';
                            font-size: 4em;
                            color: #cbd5e1;
                            position: absolute;
                            left: 0.5rem;
                            top: -0.5rem;
                            line-height: 1;
                        }
                        
                        /* Code styles */
                        code { 
                            background-color: #f1f5f9; 
                            color: #e11d48;
                            padding: 0.2rem 0.4rem; 
                            border-radius: 0.375rem;
                            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                            font-size: 0.9em;
                            font-weight: 500;
                        }
                        pre { 
                            background-color: #1e293b; 
                            color: #f1f5f9; 
                            padding: 1.5rem; 
                            border-radius: 0.75rem;
                            overflow-x: auto;
                            margin: 1.5em 0;
                            border: 1px solid #334155;
                            position: relative;
                        }
                        pre code {
                            background: none;
                            color: inherit;
                            padding: 0;
                            border-radius: 0;
                            font-size: 0.875em;
                        }
                        
                        /* Tables */
                        table { 
                            border-collapse: collapse; 
                            width: 100%; 
                            margin: 1.5em 0;
                            border-radius: 0.5rem;
                            overflow: hidden;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        }
                        table td, table th { 
                            border: 1px solid #e2e8f0; 
                            padding: 0.75rem 1rem; 
                            text-align: left;
                        }
                        table th { 
                            background-color: #f8fafc; 
                            font-weight: 600;
                            color: #334155;
                            border-bottom: 2px solid #cbd5e1;
                        }
                        table tr:nth-child(even) {
                            background-color: #f9fafb;
                        }
                        table tr:hover {
                            background-color: #f1f5f9;
                        }
                        
                        /* Images */
                        img { 
                            max-width: 100%; 
                            height: auto; 
                            border-radius: 0.75rem;
                            margin: 1.5em auto;
                            display: block;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }
                        
                        /* Lists */
                        ul, ol { 
                            margin: 1.25em 0; 
                            padding-left: 2em; 
                        }
                        li { 
                            margin-bottom: 0.5em; 
                            line-height: 1.6;
                        }
                        ul li {
                            list-style-type: none;
                            position: relative;
                        }
                        ul li:before {
                            content: '•';
                            color: #3b82f6;
                            font-weight: bold;
                            position: absolute;
                            left: -1.25em;
                        }
                        
                        /* Links */
                        a {
                            color: #3b82f6;
                            text-decoration: none;
                            border-bottom: 1px solid transparent;
                            transition: all 0.2s;
                        }
                        a:hover {
                            border-bottom-color: #3b82f6;
                        }
                        
                        /* Horizontal rule */
                        hr {
                            border: none;
                            height: 2px;
                            background: linear-gradient(to right, transparent, #cbd5e1, transparent);
                            margin: 2em 0;
                        }
                        
                        /* Selection */
                        ::selection {
                            background-color: #dbeafe;
                            color: #1e40af;
                        }
                    `,
                    
                    // File handling
                    file_picker_types: 'image',
                    file_picker_callback: (cb: FilePickerCallback, value: string, meta: FilePickerMeta) => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');

                        input.addEventListener('change', (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.addEventListener('load', () => {
                                    const id = 'blobid' + (new Date()).getTime();
                                    const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                                    const base64 = (reader.result as string).split(',')[1];
                                    const blobInfo = blobCache.create(id, file, base64);
                                    blobCache.add(blobInfo);
                                    cb(blobInfo.blobUri(), { title: file.name });
                                });
                                reader.readAsDataURL(file);
                            }
                        });

                        input.click();
                    },
                    
                    // Advanced options
                    branding: false,
                    promotion: false,
                    elementpath: true,
                    resize: 'both',
                    statusbar: true,
                    
                    // Modern UI
                    skin: 'oxide',
                    icons: 'thin',
                    toolbar_sticky: true,
                    toolbar_location: 'top',
                    
                    // Auto-save dengan interval yang lebih pendek
                    autosave_ask_before_unload: true,
                    autosave_interval: '15s',
                    autosave_prefix: 'chapter-autosave-',
                    autosave_restore_when_empty: false,
                    autosave_retention: '10m',
                    
                    // Word count
                    wordcount_countregex: /[\w\u2019\'-]+/g,
                    
                    // Link options
                    link_assume_external_targets: true,
                    target_list: [
                        {title: 'New page', value: '_blank'},
                        {title: 'Same page', value: '_self'}
                    ],
                    
                    // Table options
                    table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                    table_appearance_options: false,
                    table_advtab: false,
                    table_cell_advtab: false,
                    table_row_advtab: false,
                    
                    // Image options
                    image_advtab: true,
                    image_caption: true,
                    image_description: false,
                    image_dimensions: false,
                    image_title: true,
                    
                    // Code sample
                    codesample_languages: [
                        {text: 'HTML/XML', value: 'markup'},
                        {text: 'JavaScript', value: 'javascript'},
                        {text: 'CSS', value: 'css'},
                        {text: 'PHP', value: 'php'},
                        {text: 'Python', value: 'python'},
                        {text: 'Java', value: 'java'},
                        {text: 'C', value: 'c'},
                        {text: 'C++', value: 'cpp'},
                        {text: 'C#', value: 'csharp'},
                        {text: 'SQL', value: 'sql'},
                        {text: 'JSON', value: 'json'}
                    ]
                }}
            />
            </div>
        </div>
    );
}