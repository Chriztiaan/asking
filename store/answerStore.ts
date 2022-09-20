import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { supabase } from './setup/supabase';
import { Answer, AnswerSet, Question } from './types/DatabaseModels';

export const useAnswerStore = defineStore('answer', {
    state: () => ({
        answerSets: [] as AnswerSet[],
        loading: false,
        // Contains answers per answer set
        answers: [] as Array<{ key: string; answers: Answer[] }>,
        // Contains mappings between answers and their questions
        pairs: [] as Array<{ answer: Answer; question: Question }>
    }),

    actions: {
        async retrieveAnswerSets(): Promise<void> {
            this.answers = [];
            this.answerSets = [];
            this.loading = true;

            const { data, error } = await supabase.from('answer_sets').select().match({ user_id: useAuthStore().userId }).limit(50);

            if (!error && !!data) {
                this.answerSets = data;
            } else {
                console.log(error);
            }

            this.loading = false;
        },
        async retrieveAnswers(answerSetId: string): Promise<void> {
            const { data, error } = await supabase.from('answers').select().match({ answer_set_id: answerSetId }).limit(50);

            if (!error && !!data) {
                this.answers.push({ key: answerSetId, answers: data });
                console.log('answers');
                console.log(data);
                await this.retrieveQuestionsForAnswers(data);
            } else {
                console.log(error);
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
            console.log(data);
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
                console.log(error);
            }
        },
        async upsertAnswer(answer: Answer): Promise<void> {
            this.loading = true;

            const { data, error } = await supabase.from('answers').upsert(answer).select().single();

            if (!error && !!data) {
                const answersSetEntry = this.answers.find((list) => list.key == data.answer_set_id);
                if (answersSetEntry) {
                    const answerEntry = answersSetEntry.answers.find((a) => a.id == data.id);
                    if (answerEntry) {
                        Object.assign(answerEntry, data);
                    } else {
                        answersSetEntry.answers.push(data);
                    }
                }
            } else {
                console.log(error);
            }

            this.loading = false;
        }
    }
});
