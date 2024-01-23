/// <reference types="chrome"/>

import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  createAlarm(task: Task) {
    const formattedDateTime = task.duedate + 'T' + task.dueTime;
    const alarmName = 'taskAlarm_' + task.id; // Unique alarm name using task ID
    const time = new Date(formattedDateTime).getTime();
    const now = new Date().getTime();
    const delayInMinutes = Math.max((time - now) / 60000, 1); // Ensure minimum 1 minute delay

    chrome.alarms.create(alarmName, { delayInMinutes: delayInMinutes });
    console.log(`Alarm set for task ${task.id} at time: `, time);

    chrome.storage.local.set({ [alarmName]: task }, function () {
      if (chrome.runtime.lastError) {
        console.log("Error setting alarm data:", chrome.runtime.lastError.message);
      } else {
        console.log("Alarm data set successfully for", alarmName);
      }
    });
  }

  deleteAlarm(taskId: string) {
    const alarmName = 'taskAlarm_' + taskId;

    chrome.alarms.clear(alarmName, (wasCleared) => {
      console.log(wasCleared ? `Alarm ${alarmName} cleared successfully` : `Failed to clear alarm ${alarmName}`);
    });

    chrome.storage.local.remove(alarmName, () => {
      console.log(`Storage data for ${alarmName} removed`);
    });
  }
}
