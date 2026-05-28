// Disable Developer Tools and Inspect

// Disable right-click context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    console.log('%c⚠️ Right-click is disabled!', 'color: red; font-size: 14px;');
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        console.log('%c⚠️ Developer tools are disabled!', 'color: red; font-size: 14px;');
    }
    // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
    }
    // Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
    }
    // Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
    }
});

// Detect DevTools opening
setInterval(() => {
    const devToolsOpen = window.outerHeight - window.innerHeight > 100 ||
                         window.outerWidth - window.innerWidth > 100;
    if (devToolsOpen) {
        console.clear();
        console.log('%c⚠️ Please close the developer tools!', 'color: red; font-size: 14px;');
    }
}, 500);

