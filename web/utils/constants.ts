export const VALIDATION_MESSAGES = {
    EMAIL_INVALID: 'Невірний формат електронної пошти',
    AUTH_ERROR: 'Помилка авторизації',
    REQUIRED_FIELD: (label: string) => `Будь ласка, заповніть поле "${label}".`,
    MIN_LENGTH: (label: string, min: number) => `Поле "${label}" має містити щонайменше ${min} символів.`,
    PASSWORD_MISMATCH: 'Паролі не співпадають.',
    PASSWORD_MIN_LENGTH: (min: number) => `Пароль має бути щонайменше ${min} символів.`,
    PASSWORD_SET_SUCCESS: 'Новий пароль встановлено!',
    GENERIC_ERROR: 'Сталася помилка. Спробуйте пізніше.',
    INVALID_OR_EXPIRED_TOKEN: 'Недійсний або прострочений токен',
};

export const PASSWORD_MIN_LENGTH = 8;

export const ORGANIZATION_TYPES = {
    VET_CLINIC: 'Ветклініка',
    CNAP: 'ЦНАП',
    SHELTER: 'Притулок',
    USER: 'user',
};

export const ROUTES = {
    HOME: '/home',
    LOGIN: '/login',
    VET_CLINIC_HOME: '/Vet-Clinic/favorite-list',
    CNAP_HOME: '/CNAP/favorite-list',
    SHELTER_HOME: '/Alley/pet-list',
    SIGN_IN: '/signIn',
};