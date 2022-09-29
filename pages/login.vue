<template>
    <div class="d-flex justify-center">
        <v-card class="d-flex flex-column align-center py-12 px-8 gap-6" elevation="4" width="400">
            <logo-text style="max-height: 75px; max-width: 75px" />
            <!-- <header-4>Welcome</header-4> -->
            <div class="d-flex flex-column gap-3">
                <v-btn color="#DB4437" class="white--text" @click="google">
                    <v-icon left>mdi-google</v-icon>
                    Continue with Google
                </v-btn>
                <v-btn color="#0077b5" class="white--text" @click="linkedIn">
                    <v-icon size="20" left>mdi-linkedin</v-icon>
                    Continue with Linkedin
                </v-btn>
                <!-- <v-btn @click="logout">Logout</v-btn> -->
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useAuthStore } from '@/store/authStore';
import LogoText from '@/assets/logoText.vue';
export default Vue.extend({
    components: { LogoText },
    layout: 'default',
    methods: {
        google(): void {
            useAuthStore().loginGoogle();
        },
        linkedIn(): void {
            useAuthStore().loginLinkedIn();
        },
        logout(): void {
            useAuthStore().logout();
        }
    }
});
</script>
