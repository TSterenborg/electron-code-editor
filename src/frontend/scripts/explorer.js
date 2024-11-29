const folderTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="chevron ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8d5;</span>
        <span class="flex h-full items-center px-[8px] text-[14px]">${name}</span>
    </div>
`;

const fileTemplate = (name) => `
    <div class="flex h-[25px] w-full cursor-pointer items-center hover:bg-fill_primary_hover">
        <span class="invisible ml-[12px] flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[10px]">&#xe970;</span>
        <span class="flex h-full w-[24px] items-center justify-center font-segoefluenticons text-[14px]">&#xe8a5;</span>
        <span class="flex h-full items-center px-[8px] text-[14px]">${name}</span>
    </div>
`;

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
            fileDiv.addEventListener("click", (event) => {
                event.stopPropagation();
                console.log(entry.path);
            });
        }
        
        parentElement.appendChild(listItem);
    });
}