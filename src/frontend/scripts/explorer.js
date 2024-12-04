import * as monaco from "monaco-editor";

let editorInstance = null;
let currentFilePath = null;

const folderTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="chevron ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8d5;</span>
        <span class="flex h-full w-full items-center truncate px-[8px] text-[14px]">${name}</span>
    </div>
`;

const fileTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="invisible ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8a5;</span>
        <span class="flex h-full w-full items-center truncate px-[8px] text-[14px]">${name}</span>
    </div>
`;

const detectLanguage = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    const languages = monaco.languages.getLanguages();

    const language = languages.find(lang => lang.extensions && lang.extensions.includes(`.${ext}`));

    return language ? language.id : "plaintext";
};

const autoSave = async () => {
    if (!currentFilePath || !editorInstance) {
        return;
    }

    const content = editorInstance.getValue();
    try {
        await window.electron.saveFile(currentFilePath, content);
        console.log(`Auto-saved: ${currentFilePath}`);
    } catch (error) {
        console.error(`Failed to auto-save: ${error.message}`);
    }
};

document.getElementById("openProjectButton").addEventListener("click", async () => {
    const entries = await window.electron.openProject();
    document.getElementById("projectEntries").innerHTML = "";
    renderEntries(entries, document.getElementById("projectEntries"));
});

function renderEntries(entries, parentElement, level = 0) {
    entries.forEach((entry) => {
        const template = entry.isDirectory
            ? folderTemplate(entry.name)
            : fileTemplate(entry.name);

        const listItem = document.createElement("li");
        listItem.innerHTML = template;

        const div = listItem.querySelector("div");
        div.classList.add("nested-entry");

        if (level > 0) {
            div.style.paddingLeft = `${level * 24}px`;
        }

        if (entry.isDirectory) {
            const folderDiv = listItem.querySelector(".cursor-pointer");
            const chevron = listItem.querySelector(".chevron");

            folderDiv.addEventListener("click", async (event) => {
                event.stopPropagation();

                if (listItem.classList.contains("expanded")) {
                    listItem.classList.remove("expanded");
                    listItem.querySelectorAll(".nested").forEach(nested => nested.remove());
                    chevron.innerHTML = "&#xe970;";
                } else {
                    const subEntries = await window.electron.getFolderContent(entry.path);
                    const nestedList = document.createElement("ul");
                    nestedList.classList.add("nested");
                    renderEntries(subEntries, nestedList, level + 1);
                    listItem.appendChild(nestedList);
                    listItem.classList.add("expanded");
                    chevron.innerHTML = "&#xe96e;";
                }
            });
        } else {
            const fileDiv = listItem.querySelector(".cursor-pointer");
            fileDiv.addEventListener("click", async (event) => {
                event.stopPropagation();
                console.log(entry.path);

                const fileContent = await window.electron.readFile(entry.path);

                if (fileContent === null) {
                    console.error("Failed to load file content");
                    return;
                }

                const language = detectLanguage(entry.name);

                currentFilePath = entry.path;

                if (!editorInstance) {
                    monaco.editor.defineTheme("vs-custom", {
                        base: "vs-dark",
                        inherit: true,
                        rules: [],
                        colors: {
                            "editor.background": "#181818",
                        }
                    });
                    
                    editorInstance = monaco.editor.create(document.getElementById("editorContainer"), {
                        value: fileContent,
                        language,
                        theme: "vs-dark",
                        automaticLayout: true,
                        minimap: {
                            enabled: false
                        },
                        theme: "vs-custom",
                    });

                    editorInstance.onDidChangeModelContent(() => {
                        autoSave();
                    });
                } else {
                    editorInstance.setValue(fileContent);
                    monaco.editor.setModelLanguage(editorInstance.getModel(), language);
                }

                editorInstance.setPosition({ lineNumber: 1, column: 1 });
                editorInstance.revealPositionInCenter({ lineNumber: 1, column: 1 });
            });
        }

        parentElement.appendChild(listItem);
    });
}