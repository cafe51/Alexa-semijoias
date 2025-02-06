export function serializeData(data: any) {
    if (data instanceof Date) {
        return data.toISOString();
    }
    if (data && typeof data === 'object') {
        if (data.toDate && typeof data.toDate === 'function') {
            return data.toDate().toISOString();
        }
        if (data.toJSON && typeof data.toJSON === 'function') {
            return data.toJSON();
        }
        const result: any = Array.isArray(data) ? [] : {};
        for (const key in data) {
            result[key] = serializeData(data[key]);
        }
        return result;
    }
    return data;
}