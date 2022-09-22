<template>
    <v-snackbar v-model="showNotification" :timeout="3500" :left="!isMobile">
        <template v-if="notification">
            {{ notification.text }}
        </template>
    </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { isMobile } from '@/utils/screen';
import { Notification, useNotificationStore } from '@/store/notificationStore';

export default Vue.extend({
    data() {
        return {
            showNotification: false
        };
    },
    computed: {
        isMobile(): boolean {
            return isMobile(this.$vuetify);
        },
        notification(): Notification | undefined {
            return useNotificationStore().currentNotification;
        }
    },
    watch: {
        showNotification(): void {
            if (!this.showNotification) {
                this.$nextTick(() => {
                    useNotificationStore().consumeNotification();
                });
            }
        },
        notification(): void {
            if (this.notification) {
                this.showNotification = true;
            }
        }
    }
});
</script>
