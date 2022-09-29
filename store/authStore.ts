import { SignInWithOAuthCredentials } from '@supabase/supabase-js';
import { defineStore } from 'pinia';
import { useNotificationStore } from './notificationStore';
import { supabase } from './setup/supabase';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        userId: '92db24d4-5290-4819-9bac-7de8efe7d603'
    }),

    getters: {
        // double: (state) => state.n * 2,
    },

    actions: {
        login(): void {
            supabase.auth.signInWithPassword({} as any);
        },
        async loginGoogle(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: 'https://master--stalwart-kringle-8f06cb.netlify.app/admin/' }
            } as SignInWithOAuthCredentials);
            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        async loginLinkedIn(): Promise<void> {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'linkedin',
                options: { redirectTo: 'https://master--stalwart-kringle-8f06cb.netlify.app/admin/' }
            } as SignInWithOAuthCredentials);

            if (error) {
                useNotificationStore().addNotification('Failed to log in.');
            }
        },
        logout(): void {
            supabase.auth.signOut();
            this.loggedIn = false;
        },
        onAuthChange(): void {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event == 'USER_DELETED' || event == 'SIGNED_OUT') {
                    this.logout();
                    console.log('Auto logout', session);
                }
            });
        }
    }
});
