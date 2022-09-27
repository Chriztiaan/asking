import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { notificationDelete, notificationDeleteFailed, notificationFailedSubmit, notificationSubmit, useNotificationStore } from './notificationStore';
import { supabase } from './setup/supabase';
import { Answer, AnswerSet, Question } from './types/DatabaseModels';

export const useAnswerStore = defineStore('answer', {
    state: () => ({
        answerSets: [] as AnswerSet[],
        loading: false,
        // Contains answers per answer set
        answers: [] as Array<{ key: string; answers: Answer[] }>,
        // Contains mappings between answers and their questions
        pairs: [] as Array<{ answer: Answer; question: Question }>,

        answersSubmitting: false,
        submitted: false
    }),

    actions: {
        async retrieveAnswerSets(): Promise<void> {
            this.answers = [];
            this.answerSets = [];
            this.loading = true;

            const { data, error } = await supabase.from('answer_sets').select().match({ user_id: useAuthStore().userId }).order('created_at', { ascending: false }).limit(50);

            if (!error && !!data) {
                this.answerSets = data;
            } else {
                useNotificationStore().addNotification('Failed to retrieve answer sets.');
            }

            this.loading = false;
        },
        async retrieveAnswers(answerSetId: string): Promise<void> {
            const { data, error } = await supabase.from('answers').select().match({ answer_set_id: answerSetId }).limit(50);

            if (!error && !!data) {
                this.answers.push({ key: answerSetId, answers: data });
                await this.retrieveQuestionsForAnswers(data);
            } else {
                useNotificationStore().addNotification('Failed to retrieve answers.');
            }
        },
        async retrieveQuestionsForAnswers(answers: Answer[]): Promise<void> {
            // TODO CL sort by Question creation date?
            const { data, error } = await supabase
                .from('questions')
                .select()
                .in(
                    'id',
                    answers.map((a) => a.question_id)
                )
                .limit(50);

            if (!error && !!data) {
                for (const answer of answers) {
                    const question = data.find((q) => q.id == answer.question_id);
                    if (question) {
                        this.pairs.push({ answer, question });
                    } else {
                        console.error("Question doesn't exist for answer:", answer.id);
                    }
                }
            } else {
                useNotificationStore().addNotification('Failed to retrieve questions.');
            }
        },
        async deleteAnswerSet(answerSetId: string): Promise<void> {
            const { error } = await supabase.from('answer_sets').delete().match({ id: answerSetId });

            if (!error) {
                const index = this.answerSets.findIndex((answerSet) => answerSet.id == answerSetId);
                if (index > -1) {
                    useNotificationStore().addNotification(notificationDelete);
                    this.answerSets.splice(index, 1);
                }
            } else {
                useNotificationStore().addNotification(notificationDeleteFailed);
            }
        },
        async submitAnswers(answerSet: AnswerSet, answers: Answer[]): Promise<void> {
            this.answersSubmitting = true;
            const { error: answerSetError } = await supabase.from('answer_sets').insert(answerSet);
            try {
                if (answerSetError) {
                    useNotificationStore().addNotification(notificationFailedSubmit);
                    return;
                }

                const { error } = await supabase.from('answers').insert(answers);
                if (error) {
                    useNotificationStore().addNotification(notificationFailedSubmit);
                    return;
                }

                useNotificationStore().addNotification(notificationSubmit);
                this.submitted = true;
            } finally {
                this.answersSubmitting = false;
            }
        }
    }
});
