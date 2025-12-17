export function todayIsoDate(): string {
    return new Date().toISOString().split('T')[0];
}

export function toIsoDateInput(
    dateString?: string | null,
    fallbackToToday: boolean = false,
): string {
    if (!dateString) {
        return fallbackToToday ? todayIsoDate() : '';
    }

    const dotParts = dateString.split('.');
    if (dotParts.length === 3) {
        const [day, month, year] = dotParts;
        return `${year}-${month}-${day}`;
    }

    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }

    return dateString;
}

export function fromIsoDateInputToDot(dateString?: string | null): string {
    if (!dateString) return '';

    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (!isoMatch) return dateString;

    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

export function formatUaDate(dateString?: string | null): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}
