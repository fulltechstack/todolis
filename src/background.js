chrome.alarms.onAlarm.addListener(function (alarm) {
    console.log("Alarm triggered:", alarm);

    if (alarm.name.startsWith("taskAlarm_")) {
        const alarmKey = alarm.name;
        chrome.storage.local.get(alarmKey, (result) => {
            if (result[alarmKey]) {
                let task = result[alarmKey];

                chrome.notifications.create("", {
                    type: "basic",
                    iconUrl: "icon.png",
                    // title: task.name || "Task Reminder",
                    title: "Time to wrap up '" + task.name + "'." || "Task Reminder",
                    // message: task.description || "You have a task due!",
                    message: "Already finished? Don't forget to mark it as complete! ✅" || "You have a task due!",
                    priority: 2
                });
            } else {
                console.log("No task data found for", alarmKey);
            }
        });
    } else {
        console.log("Unrecognized alarm:", alarm.name);
    }
});
