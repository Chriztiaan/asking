<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="12" md="2" class="d-flex flex-column align-center align-md-start">
                <header-1 :class="{ 'ml-4': !isMobile }">Manage</header-1>
                <div class="mt-4 d-flex flex-column align-center align-md-start gap-3 manage-btns">
                    <!-- <v-btn text width="180" :class="{ selected: isDashboard }" class="f-18 w-500" @click="setPage(Page.dashboard)">
                        <v-icon class="mr-4" color="tertiary" left size="24">mdi-view-dashboard</v-icon>
                        Dashboard
                    </v-btn> -->
                    <v-btn text width="180" :class="{ selected: isQuestions }" class="f-18 w-500" @click="setPage(Page.questions)">
                        <v-icon class="mr-4" color="tertiary" left size="24">mdi-clipboard-text</v-icon>
                        Questions
                    </v-btn>
                    <v-btn text width="180" :class="{ selected: isAnswers }" class="f-18 w-500" @click="setPage(Page.answers)">
                        <v-icon class="mr-4" color="tertiary" left size="24">mdi-format-list-text</v-icon>
                        Answers
                    </v-btn>
                    <v-btn text width="180" :class="{ selected: isProfile }" class="f-18 w-500" @click="setPage(Page.profile)">
                        <v-icon class="mr-4" color="tertiary" left size="24">mdi-account-circle</v-icon>
                        Profile
                    </v-btn>
                </div>
            </v-col>
            <v-col class="" cols="12" md="6" style="max-width: 853px">
                <div style="max-width: 487px">
                    <!-- <dashboard v-if="isDashboard" /> -->
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
import answers from '~/components/pages/admin/answers.vue';

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
        }
    },
    methods: {
        setPage(page: Page): void {
            this.selectedPage = page;
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
