<template>
    <div class="d-flex justify-center">
        <v-card class="d-flex flex-column py-12 px-8 gap-2" elevation="4" width="600">
            <header-5>Sign in with</header-5>
            <div class="d-flex gap-4">
                <v-btn color="primary" @click="google">
                    <v-icon size="20" left>mdi-google</v-icon>
                    Google
                </v-btn>
                <v-btn color="primary">
                    <v-icon size="20" left>mdi-linkedin</v-icon>
                    Linkedin
                </v-btn>
                <!-- <v-btn @click="logout">Logout</v-btn> -->
            </div>
        </v-card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { useAuthStore } from '@/store/authStore';

export default Vue.extend({
    layout: 'default',
    methods: {
        google(): void {
            useAuthStore().loginGoogle();
        },
        logout(): void {
            useAuthStore().logout();
        }
    }
});
</script>
