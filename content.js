function getParticipants() {
    const names = new Set();

    document.querySelectorAll("[data-participant-id]").forEach(el => {
        const name = el.innerText
            .split("\n")[0]
            .trim();

        if(name) {
            names.add(name);
        }
    });

    return [...names];
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if(msg.type === "GET_ATTENDANCE") {
        sendResponse(getParticipants());
    }
});