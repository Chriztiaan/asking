import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { notificationFailedSaved, notificationSaved, notificationUploadProfilePicture, useNotificationStore } from './notificationStore';
import { supabase } from './setup/supabase';
import { Profile } from './types/DatabaseModels';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: undefined as Profile | undefined,
        questionnaireProfile: undefined as Profile | undefined,
        retrieving: false,
        updating: false,
        profilePicture: '',
        loadingProfilePicture: false,
        updatingProfilePicture: false,

        questionnaireProfilePicture: '',
        loadingQuestionnaireProfilePicture: false
    }),

    actions: {
        async retrieveProfile(userIdOrReference = '', useUserId = false): Promise<boolean> {
            const derivedUserId = userIdOrReference || useAuthStore().userId;
            this.retrieving = true;

            try {
                if (!useUserId) {
                    const { data: referenceData, error: referenceError } = await supabase.from('profiles').select().match({ reference: derivedUserId }).limit(1).single();
                    if (!referenceError && !!referenceData) {
                        this.profile = referenceData;
                        return true;
                    }
                }

                const { data, error } = await supabase.from('profiles').select().match({ user_id: derivedUserId }).limit(1).single();

                if (!error && !!data) {
                    this.profile = data;
                    return true;
                }

                return false;
            } finally {
                this.retrieving = false;
            }
        },
        async retrieveQuestionnaireProfile(userIdOrReference = '', useUserId = false): Promise<boolean> {
            const derivedUserId = userIdOrReference || useAuthStore().userId;
            this.retrieving = true;

            try {
                if (!useUserId) {
                    const { data: referenceData, error: referenceError } = await supabase.from('profiles').select().match({ reference: derivedUserId }).limit(1).single();
                    if (!referenceError && !!referenceData) {
                        this.questionnaireProfile = referenceData;
                        return true;
                    }
                }

                const { data, error } = await supabase.from('profiles').select().match({ user_id: derivedUserId }).limit(1).single();

                if (!error && !!data) {
                    this.questionnaireProfile = data;
                    return true;
                }

                return false;
            } finally {
                this.retrieving = false;
            }
        },
        async upsertProfile(profile: Profile, silent = false): Promise<void> {
            this.updating = true;
            if (!profile.reference) {
                profile.reference = null;
            }
            const { data, error } = await supabase.from('profiles').upsert(profile).select().single();

            if (!error && !!data) {
                this.profile = data;
                if (!silent) {
                    useNotificationStore().addNotification(notificationSaved);
                }
            } else if (!silent) {
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
                const newProfile = structuredClone(this.profile);
                if (newProfile) {
                    newProfile.profile = '';
                    await useProfileStore().upsertProfile(newProfile);
                }
            } else {
                useNotificationStore().addNotification('Failed to update profile picture');
                console.error(error);
            }
            this.retrieveProfilePicture();
            this.updatingProfilePicture = false;
        },
        async retrieveProfilePicture(userId = ''): Promise<void> {
            if (this.profile && this.profile.profile) {
                this.profilePicture = this.profile.profile;
                return;
            }
            this.loadingProfilePicture = true;
            const derivedUserId = userId || useAuthStore().userId;

            const { data, error } = await supabase.storage.from('avatars').createSignedUrl('public/' + derivedUserId, 600000);

            if (!error && data.signedUrl) {
                this.profilePicture = data.signedUrl;
            } else {
                this.profilePicture = '';
                useNotificationStore().addNotification('Failed to retrieve profile picture.');
            }

            this.loadingProfilePicture = false;
        },
        async retrieveQuestionnaireProfilePicture(userId = ''): Promise<void> {
            this.loadingQuestionnaireProfilePicture = true;
            const derivedUserId = userId || useAuthStore().userId;

            const { data, error } = await supabase.storage.from('avatars').createSignedUrl('public/' + derivedUserId, 600000);

            if (!error && data.signedUrl) {
                this.questionnaireProfilePicture = data.signedUrl;
            } else {
                this.questionnaireProfilePicture = '';
                if (!this.questionnaireProfile?.profile) {
                    useNotificationStore().addNotification('Failed to retrieve profile picture.');
                }
            }

            this.loadingQuestionnaireProfilePicture = false;
        }
    }
});
