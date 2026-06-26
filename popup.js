const status = document.getElementById("status");

function showStatus(message, isError = false) {
    status.textContent = message;
    status.className = isError ? "error" : "success";

    setTimeout(() => {
        status.textContent = "";
        status.className = "";
    }, 4000);
}

async function getParticipants() {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_ATTENDANCE" },
            (participants) => {

                if (chrome.runtime.lastError) {
                    reject("Open a Google Meet first");
                    return;
                }

                if (!participants || participants.length === 0) {
                    reject("No participants found");
                    return;
                }

                resolve(participants);
            }
        );
    });
}

document
    .getElementById("download")
    .addEventListener("click", async () => {

        try {
            const participants = await getParticipants();

            let content =
                `Attendance Report\nGenerated: ${new Date().toLocaleString()}\n---------------------------------\n\n`;

            participants.forEach(name => {
                content += `${name}\n`;
            });

            const blob = new Blob(
                [content],
                { type: "text/plain" }
            );

            const url = URL.createObjectURL(blob);

            chrome.downloads.download(
                {
                    url,
                    filename: `attendance-${Date.now()}.txt`
                },
                () => URL.revokeObjectURL(url)
            );

            showStatus(
                `Exported ${participants.length} participants`
            );

        } catch (err) {
            showStatus(`${err}`, true);
        }
    });

document
    .getElementById("copy")
    .addEventListener("click", async () => {

        try {
            const participants = await getParticipants();

            await navigator.clipboard.writeText(
                participants.join("\n")
            );

            showStatus(
                `Copied ${participants.length} names`
            );

        } catch (err) {
            showStatus(`${err}`, true);
        }
    });