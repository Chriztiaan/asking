import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { notificationFailedSaved, notificationSaved, useNotificationStore } from './notificationStore';
import { supabase } from './setup/supabase';
import { Question, Questionnaire } from './types/DatabaseModels';

export const useQuestionnaireStore = defineStore('questionnaire', {
    state: () => ({
        questionnaire: undefined as Questionnaire | undefined,
        questions: [] as Question[],
        loading: false,
        questionsLoading: false,
        updating: false,
        questionsUpdating: false
    }),

    actions: {
        async retrieveQuestionnaire(userId = ''): Promise<void> {
            const derivedUserId = userId || useAuthStore().userId;
            this.questionnaire = undefined;
            this.loading = true;

            let { data, error } = await supabase.from('questionnaires').select().match({ user_id: derivedUserId }).limit(1).single();

            // Profile doesn't exist yet
            if (error && error.code == 'PGRST116' && derivedUserId == useAuthStore().userId) {
                const questionnaire = {} as Questionnaire;
                await this.upsertQuestionnaire(questionnaire);
                if (!this.questionnaire) {
                    return;
                }

                error = undefined;
                data = this.questionnaire;
            }

            if (!error && !!data) {
                this.questionnaire = data;
                this.retrieveQuestionsByQuestionnaire(this.questionnaire.user_id);
            } else {
                useNotificationStore().addNotification('Failed to retrieve questionnaire.');
            }

            this.loading = false;
        },
        async retrieveQuestionsByQuestionnaire(questionnaireId: string): Promise<void> {
            this.questions = [];
            this.questionsLoading = true;

            const { data, error } = await supabase.from('questions').select().match({ questionnaire_id: questionnaireId }).limit(50).order('created_at', { ascending: true });

            if (!error) {
                this.questions = data;
            } else {
                useNotificationStore().addNotification('Failed to retrieve questions.');
            }

            this.questionsLoading = false;
        },
        async upsertQuestionnaire(questionnaire: Questionnaire): Promise<void> {
            this.updating = true;

            const { data, error } = await supabase.from('questionnaires').upsert(questionnaire).select().single();

            if (!error && !!data) {
                this.questionnaire = data;
            } else {
                useNotificationStore().addNotification(notificationFailedSaved);
            }

            this.updating = false;
        },
        async upsertQuestion(question: Question): Promise<void> {
            const { data, error } = await supabase.from('questions').upsert(question).select().single();

            if (!error && !!data) {
                const q = this.questions.find((q) => q.id == data.id);
                if (q) {
                    Object.assign(q, data);
                } else {
                    this.questions.push(data);
                }
                Object.assign(question, data);
            } else {
                useNotificationStore().addNotification(notificationFailedSaved);
            }
        },

        async upsertQuestions(questions: Question[]): Promise<void> {
            this.questionsUpdating = true;

            const newIds = questions.map((q) => q.id);
            const oldIds = this.questions.map((q) => q.id);
            const softDeleteIds = oldIds.filter((i) => !newIds.includes(i));

            const created = questions.filter((q) => !oldIds.includes(q.id));
            const updated = questions.filter((q) => oldIds.includes(q.id));
            const deleted = this.questions.filter((q) => softDeleteIds.includes(q.id));

            deleted.forEach((u) => {
                u.questionnaire_id = null;
            });

            const { data: insertData, error: insertError } = await supabase.from('questions').upsert(created).select().order('created_at', { ascending: true });

            const { data: upsertData, error: upsertError } = await supabase.from('questions').upsert(updated).select().order('created_at', { ascending: true });

            await supabase.from('questions').upsert(deleted).select().order('created_at', { ascending: true });

            if (!insertError && !upsertError && !!insertData && !!upsertData) {
                this.questions = [...upsertData, ...insertData];
                useNotificationStore().addNotification(notificationSaved);
            } else {
                useNotificationStore().addNotification(notificationFailedSaved);
            }

            this.questionsUpdating = false;
        }
    }
});
