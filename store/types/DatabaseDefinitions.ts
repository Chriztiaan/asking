export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            answers: {
                Row: {
                    id: string;
                    content: string | null;
                    created_at: string | null;
                    answer_set_id: string;
                    question_id: string;
                };
                Insert: {
                    id?: string;
                    content?: string | null;
                    created_at?: string | null;
                    answer_set_id: string;
                    question_id: string;
                };
                Update: {
                    id?: string;
                    content?: string | null;
                    created_at?: string | null;
                    answer_set_id?: string;
                    question_id?: string;
                };
            };
            answer_sets: {
                Row: {
                    id: string;
                    company: string | null;
                    contact_person: string | null;
                    email: string | null;
                    notes: string | null;
                    salary: string | null;
                    leave: string | null;
                    remote: number;
                    created_at: string | null;
                    phone_number: string | null;
                    user_id: string | null;
                };
                Insert: {
                    id?: string;
                    company?: string | null;
                    contact_person?: string | null;
                    email?: string | null;
                    notes: string | null;
                    salary: string | null;
                    leave: string | null;
                    remote: number;
                    created_at?: string | null;
                    phone_number?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    id?: string;
                    company?: string | null;
                    contact_person?: string | null;
                    email?: string | null;
                    notes: string | null;
                    salary: string | null;
                    leave: string | null;
                    remote: number;
                    created_at?: string | null;
                    phone_number?: string | null;
                    user_id?: string | null;
                };
            };
            questionnaires: {
                Row: {
                    user_id: string;
                    title: string | null;
                    salary: boolean;
                    leave: boolean;
                    remote: boolean;
                    created_at: string | null;
                };
                Insert: {
                    user_id: string;
                    title?: string | null;
                    salary: boolean;
                    leave: boolean;
                    remote: boolean;
                    created_at?: string | null;
                };
                Update: {
                    user_id?: string;
                    title?: string | null;
                    salary: boolean;
                    leave: boolean;
                    remote: boolean;
                    created_at?: string | null;
                };
            };
            profiles: {
                Row: {
                    user_id: string;
                    name: string | null;
                    bio: string | null;
                    profile: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    user_id: string;
                    name?: string | null;
                    bio?: string | null;
                    profile?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    user_id?: string;
                    name?: string | null;
                    bio?: string | null;
                    profile?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            questions: {
                Row: {
                    id: string;
                    created_at: string | null;
                    content: string | null;
                    questionnaire_id: string | null;
                };
                Insert: {
                    id: string;
                    created_at?: string | null;
                    content?: string | null;
                    questionnaire_id: string | null;
                };
                Update: {
                    id?: string;
                    created_at?: string | null;
                    content?: string | null;
                    questionnaire_id?: string | null;
                };
            };
        };
        Functions: {};
    };
}
