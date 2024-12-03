import * as monaco from 'monaco-editor';

monaco.editor.create(document.getElementById('editorContainer'), {
    value: `function greet() {\n\tconsole.log("Hello, Monaco Editor!");\n}`,
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
});