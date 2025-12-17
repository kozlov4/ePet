import { toIsoDateInput, fromIsoDateInputToDot } from './date';

describe('Date Utils', () => {
    describe('toIsoDateInput', () => {
        it('should return empty string for null/undefined if fallback is false', () => {
            expect(toIsoDateInput(null)).toBe('');
            expect(toIsoDateInput(undefined)).toBe('');
        });

        it('should return today date if fallback is true', () => {
            const today = new Date().toISOString().split('T')[0];
            expect(toIsoDateInput(null, true)).toBe(today);
        });

        it('should convert DD.MM.YYYY to YYYY-MM-DD', () => {
            expect(toIsoDateInput('31.12.2023')).toBe('2023-12-31');
        });

        it('should return already ISO string as is', () => {
            expect(toIsoDateInput('2023-12-31')).toBe('2023-12-31');
        });
    });

    describe('fromIsoDateInputToDot', () => {
        it('should convert YYYY-MM-DD to DD.MM.YYYY', () => {
            expect(fromIsoDateInputToDot('2023-12-31')).toBe('31.12.2023');
        });

        it('should return non-ISO string as is', () => {
            expect(fromIsoDateInputToDot('invalid')).toBe('invalid');
        });
    });
});
