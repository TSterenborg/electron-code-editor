document.getElementById("windowMin").addEventListener("click", () => window.electron.send("winMinimize"));
document.getElementById("windowMax").addEventListener("click", () => window.electron.send("winMaximize"));
document.getElementById("windowClose").addEventListener("click", () => window.electron.send("winClose"));

window.electron.on("updateMaximizeButton", (event, isMaximized) => {
    if (isMaximized) {
        document.getElementById("windowMax").innerHTML = "&#xe923;";
    } else {
        document.getElementById("windowMax").innerHTML = "&#xe922;";
    }
});