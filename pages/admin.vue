<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12" md="2" class="d-flex flex-column align-center align-md-start">
                <header-1 :class="{ 'ml-4': !isMobile }">Manage</header-1>
                <div class="mt-4 d-flex flex-column align-center align-md-start gap-3 manage-btns">
                    {{ shareLink }}
                    <v-btn text width="180" :class="{ selected: isQuestions }" class="f-18 w-500" @click="setPage(Page.questions)">
                        <v-icon class="mr-4" color="tertiary" left size="24">{{ mdiClipboardText }}</v-icon>
                        Questions
                    </v-btn>
                    <v-btn text width="180" :class="{ selected: isAnswers }" class="f-18 w-500" @click="setPage(Page.answers)">
                        <v-icon class="mr-4" color="tertiary" left size="24">{{ mdiFormatListText }}</v-icon>
                        Answers
                    </v-btn>
                    <v-btn text width="180" :class="{ selected: isProfile }" class="f-18 w-500" @click="setPage(Page.profile)">
                        <v-icon class="mr-4" color="tertiary" left size="24">{{ mdiAccountCircle }}</v-icon>
                        Profile
                    </v-btn>

                    <link-btn :icon="mdiShareVariant" width="150" max-width="180" class="pl-6" @click="copyShareLink">Share questions</link-btn>
                </div>
            </v-col>
            <v-col class="d-flex justify-center justify-md-start" cols="12" md="6">
                <div style="max-width: min(100%, 487px)" :style="!isMobile ? 'min-width: 487px;' : 'min-width: 100%;'">
                    <questions v-if="isQuestions" />
                    <answers v-else-if="isAnswers" />
                    <profile v-else-if="isProfile" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { mdiClipboardText, mdiFormatListText, mdiAccountCircle, mdiShareVariant } from '@mdi/js';
import answers from '@/components/pages/admin/answers.vue';
import { useProfileStore } from '@/store/profileStore';
import { urlBase } from '@/store/authStore';
import { notificationCopiedClipboard, useNotificationStore } from '@/store/notificationStore';

enum Page {
    dashboard,
    questions,
    answers,
    profile
}

export default Vue.extend({
    components: { answers },
    layout: 'admin',
    data() {
        return {
            mdiClipboardText,
            mdiFormatListText,
            mdiAccountCircle,
            mdiShareVariant,

            bool: true,
            selectedPage: Page.questions,
            Page
        };
    },
    computed: {
        isDashboard(): boolean {
            return this.selectedPage == Page.dashboard;
        },
        isQuestions(): boolean {
            return this.selectedPage == Page.questions;
        },
        isAnswers(): boolean {
            return this.selectedPage == Page.answers;
        },
        isProfile(): boolean {
            return this.selectedPage == Page.profile;
        },
        isMobile(): boolean {
            const name = this.$vuetify.breakpoint.name;
            return name == 'xs' || name == 'sm';
        },
        shareLink(): string {
            const url = urlBase;
            let refOrId = '';
            const profile = useProfileStore().profile;
            if (profile) {
                refOrId = profile.reference ? profile.reference : profile.user_id;

                return url + '/fill/' + refOrId;
            }

            return '';
        }
    },
    methods: {
        setPage(page: Page): void {
            this.selectedPage = page;
        },
        copyShareLink(): void {
            navigator.clipboard.writeText(this.shareLink);
            useNotificationStore().addNotification('Share link copied to clipboard.');
        }
    }
});
</script>

<style scoped lang="scss">
.manage-btns :deep(.v-btn) {
    justify-content: start;
}

.selected.v-btn {
    background: var(--v-background-base) !important;

    .v-icon {
        color: var(--v-primary-base) !important;
    }
}

.theme--dark .selected.v-btn {
    background: var(--v-primary-base) !important;
    .v-icon {
        color: var(--v-text-base) !important;
    }
}
</style>
