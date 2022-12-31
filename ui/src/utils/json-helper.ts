export const isJsonStringified = (value) => {
    try {
        const isObject = value.slice(0, 1) === '{' && value.slice(value.length - 1) === '}';
        if (typeof value === 'string' && isObject) {
            JSON.parse(value);
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
};

// JsonParse parses the stringifies value with check.
export const JsonParse = (value) => {
    if (isJsonStringified(value)) {
        return JSON.parse(value);
    }
    return value;
}

// JsonStringify stringifies the value with check.
export const JsonStringify = (value) => {
    if (isJsonStringified(value)) {
        return value;
    }
    return JSON.stringify(value);
}