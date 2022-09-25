import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

export class Notification {
    id: string;
    text: string;

    constructor(text: string) {
        this.id = uuid();
        this.text = text;
    }
}

export const notificationDelete = 'Deleted successfully.';
export const notificationDeleteFailed = 'Failed to delete.';

export const notificationFailedSubmit = 'Failed to submit.';
export const notificationSubmit = 'Submitted successfully.';

export const notificationFailedSaved = 'Failed to save.';
export const notificationSaved = 'Saved successfully.';
export const notificationUploadProfilePicture = 'Uploaded profile picture.';
export const notificationCopiedClipboard = 'Copied to clipboard.';

// TODO Handle error state
export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as Notification[]
    }),

    getters: {
        currentNotification: (state): Notification | undefined => state.notifications[0]
    },

    actions: {
        addNotification(text: string): void {
            const n = new Notification(text);
            this.notifications.push(n);
        },
        consumeNotification(): Notification | undefined {
            return this.notifications.shift();
        }
    }
});
