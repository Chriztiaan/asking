<template>
    <div class="d-flex flex-column">
        <header-1 class="primary--text">Questions</header-1>

        <div class="d-flex flex-column gap-5">
            <text-field v-model="internalTitle" :disabled="updating" :loading="retrieving" placeholder="Give your questionnaire a name">Title</text-field>

            <v-switch v-model="internalSalary" class="wfc" :disabled="updating || retrieving" :loading="retrieving" label="Query salary" hide-details inset dense />
            <v-switch v-model="internalLeave" class="wfc" :disabled="updating || retrieving" :loading="retrieving" label="Query leave" hide-details inset dense />
            <v-switch
                v-model="internalRemote"
                class="wfc"
                :disabled="updating || retrieving"
                :loading="retrieving"
                label="Query remote work policy"
                hide-details
                inset
                dense
            />

            <template v-if="!retrieving">
                <div v-for="(q, i) in internalQuestions" :key="q.id" class="d-flex align-end gap-4">
                    <text-field v-model="q.content" :disabled="updating" placeholder="What would you like to ask?">{{ i + 1 }}.</text-field>
                    <icon-btn color="error" :disabled="updating || retrieving" @click="removeQuestion(i)">mdi-trash-can</icon-btn>
                </div>
            </template>
            <template v-else>
                <div v-for="i in 3" :key="i" class="d-flex align-end gap-4 width-100">
                    <text-field class="width-100" placeholder="What would you like to ask?" loading></text-field>
                    <icon-btn loading />
                </div>
            </template>

            <v-btn v-ripple="false" class="pl-0" text plain width="220" :disabled="retrieving || updating" @click="addQuestion">
                <v-icon left class="primary--text">mdi-plus-circle-outline</v-icon>
                <div class="link-btn" :class="retrieving || updating ? 'disabled--text' : 'primary--text'">Add another question</div>
            </v-btn>

            <v-divider></v-divider>
            <div class="d-flex justify-end gap-4">
                <v-btn text color="primary" width="150" @click="reset">Cancel</v-btn>
                <v-btn color="primary" width="150" @click="save">Save</v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Question, Questionnaire } from '@/store/types/DatabaseModels';
import { useQuestionnaireStore } from '@/store/questionnaireStore';
import { useAuthStore } from '@/store/authStore';

export default Vue.extend({
    data() {
        return {
            internalQuestions: [] as Question[],

            internalSalary: false,
            internalLeave: false,
            internalRemote: false,

            internalTitle: ''
        };
    },
    computed: {
        retrieving(): boolean {
            return useQuestionnaireStore().loading || useQuestionnaireStore().questionsLoading;
        },
        updating(): boolean {
            return useQuestionnaireStore().updating || useQuestionnaireStore().questionsUpdating;
        },
        questionnaire(): Questionnaire | undefined {
            return useQuestionnaireStore().questionnaire;
        },
        title(): string {
            if (this.questionnaire && this.questionnaire.title) {
                return this.questionnaire.title;
            } else {
                return '';
            }
        },
        questions(): Question[] {
            return useQuestionnaireStore().questions;
        }
    },
    watch: {
        questions: {
            handler(): void {
                this.resetQuestions();
            },
            immediate: true
        },
        questionnaire: {
            handler(): void {
                this.resetQuestionnaire();
            },
            immediate: true
        }
    },
    mounted() {
        useQuestionnaireStore().retrieveQuestionnaire();
    },
    methods: {
        resetQuestionnaire(): void {
            if (this.questionnaire) {
                this.internalTitle = this.questionnaire.title || '';
                this.internalSalary = this.questionnaire.salary;
                this.internalLeave = this.questionnaire.leave;
                this.internalRemote = this.questionnaire.remote;
            }
        },
        resetQuestions(): void {
            this.internalQuestions = [];
            for (const question of this.questions) {
                this.internalQuestions.push(structuredClone(question));
            }
            if (!this.questions.length) {
                this.addQuestion();
            }
        },
        reset(): void {
            this.resetQuestionnaire();
            this.resetQuestions();
        },
        removeQuestion(index: number): void {
            this.internalQuestions.splice(index, 1);
            if (!this.internalQuestions.length) {
                this.addQuestion();
            }
        },
        addQuestion(): void {
            if (!this.questionnaire) {
                return;
            }
            const q = { content: '', questionnaire_id: this.questionnaire.user_id } as Question;
            this.internalQuestions.push(q);
        },
        save(): void {
            let newQuestionnaire = { user_id: useAuthStore().userId } as Questionnaire;
            if (this.questionnaire && this.questions) {
                newQuestionnaire = structuredClone(this.questionnaire);
            }

            newQuestionnaire.title = this.internalTitle;
            newQuestionnaire.salary = this.internalSalary;
            newQuestionnaire.leave = this.internalLeave;
            newQuestionnaire.remote = this.internalRemote;

            useQuestionnaireStore().upsertQuestionnaire(newQuestionnaire);

            for (const question of this.internalQuestions) {
                if (!question.questionnaire_id) {
                    question.questionnaire_id = newQuestionnaire.user_id;
                }
            }

            useQuestionnaireStore().upsertQuestions(this.internalQuestions);
        }
    }
});
</script>

<style scoped lang="scss">
.link-btn:hover {
    text-decoration: underline;
}

.theme--dark {
    .link-btn {
        color: var(--v-text-base) !important;
    }
    .v-icon {
        color: var(--v-text-base) !important;
    }
}

.item {
    max-width: 430px;
}

:deep(.text-field) {
    width: 430px !important;
    max-width: min(100%, 430px) !important;
}
</style>
