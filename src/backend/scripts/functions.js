const fs = require("fs");
const path = require("path");

function getFolderContent(folderPath) {
    const entries = fs.readdirSync(folderPath).map((file) => {
        const fullPath = path.join(folderPath, file);
        const isDirectory = fs.statSync(fullPath).isDirectory();
        return { name: file, path: fullPath, isDirectory };
    });

    entries.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
    });

    return entries;
}

module.exports = { getFolderContent };