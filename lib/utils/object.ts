export function deepOmitUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepOmitUndefined(item)) as T;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, deepOmitUndefined(entryValue)]);

    return Object.fromEntries(entries) as T;
  }

  return value;
}
