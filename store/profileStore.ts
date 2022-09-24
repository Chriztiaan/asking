import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { notificationFailedSaved, notificationSaved, notificationUploadProfilePicture, useNotificationStore } from './notificationStore';
import { supabase } from './setup/supabase';
import { Profile } from './types/DatabaseModels';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: undefined as Profile | undefined,
        retrieving: false,
        updating: false,
        profilePicture: '',
        loadingProfilePicture: false,
        updatingProfilePicture: false
    }),

    actions: {
        async retrieveProfile(userId = ''): Promise<void> {
            const derivedUserId = userId || useAuthStore().userId;
            this.retrieving = true;

            const { data, error } = await supabase.from('profiles').select().match({ user_id: derivedUserId }).limit(1).single();

            if (!error && !!data) {
                this.profile = data;
            } else {
                useNotificationStore().addNotification('Failed to retrieve profile.');
            }

            this.retrieving = false;
        },
        async upsertProfile(profile: Profile): Promise<void> {
            this.updating = true;

            const { data, error } = await supabase.from('profiles').upsert(profile).select().single();

            if (!error && !!data) {
                this.profile = data;
                useNotificationStore().addNotification(notificationSaved);
            } else {
                useNotificationStore().addNotification(notificationFailedSaved);
            }

            this.updating = false;
        },
        async uploadProfilePicture(file: File): Promise<void> {
            this.loadingProfilePicture = true;
            this.updatingProfilePicture = true;
            this.profilePicture = '';

            const derivedUserId = useAuthStore().userId;
            const { error } = await supabase.storage.from('avatars').upload('public/' + derivedUserId, file, {
                cacheControl: '3600',
                upsert: true
            });

            if (!error) {
                useNotificationStore().addNotification(notificationUploadProfilePicture);
            } else {
                useNotificationStore().addNotification('Failed to update profile picture');
                console.error(error);
            }
            this.retrieveProfilePicture();
            this.updatingProfilePicture = false;
        },
        async retrieveProfilePicture(userId = ''): Promise<void> {
            this.loadingProfilePicture = true;
            const derivedUserId = userId || useAuthStore().userId;

            const { data, error } = await supabase.storage.from('avatars').createSignedUrl('public/' + derivedUserId, 60);

            if (!error && data.signedUrl) {
                this.profilePicture = data.signedUrl;
            } else {
                this.profilePicture = '';
                useNotificationStore().addNotification('Failed to retrieve profile picture.');
            }

            this.loadingProfilePicture = false;
        }
    }
});
