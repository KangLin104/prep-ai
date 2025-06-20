export const BASE_URL = "http://localhost:8000";

export const API_PATHS =  {
    AUTH: {
        REGISTER : `/api/auth/register`,
        LOGIN: `/api/auth/login`,
        GET_PROFILE: `/api/auth/profile`,
    },

    AI: {
        GENERATE_QUESTIONS: `/api/ai/generate-questions`,
        GENERATE_EXPLANATION: `/api/ai/generate-explanation`,
    },

    SESSION: {
        CREATE: `/api/sessions/create`,
        GET_ALL: `/api/my-sessions`,
        GET_BY_ID: (id: string) => `/api/sessions/${id}`,
        DELETE_BY_ID: (id: string) => `/api/sessions/${id}`,
    },

    QUESTION: {
        ADD_TO_SESSION: `/api/questions/add`,
        PIN: (id: string) => `/api/questions/${id}/pin`,
        UPDATE_NOTE: (id: string) => `/api/questions/${id}/note`,
    }
    
}