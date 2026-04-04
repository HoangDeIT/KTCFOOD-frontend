type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonArray;

interface JsonObject {
    [key: string]: JsonValue;
}

interface JsonArray extends Array<JsonValue> { }

export function isJson(value: unknown): value is JsonValue {
    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.every(isJson);
    }

    if (typeof value === "object") {
        return Object.values(value as Record<string, unknown>).every(isJson);
    }

    return false;
}