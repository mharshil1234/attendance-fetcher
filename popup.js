document
    .getElementById("download")
    .addEventListener("click", async () => {

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        chrome.tabs.sendMessage(
            tab.id,
            { type: "GET_ATTENDANCE" },
            (participants) => {

                if(!participants) {
                    alert("Open Google Meet first");
                    return;
                }

                let csv = "Name\n";

                participants.forEach(name => {
                    csv += `"${name}"\n`;
                });

                const blob = new Blob(
                    [csv],
                    { type: "text/csv" }
                );

                const url = URL.createObjectURL(blob);

                chrome.downloads.download({
                    url,
                    filename: "attendance.csv"
                });
            }
        );
    });