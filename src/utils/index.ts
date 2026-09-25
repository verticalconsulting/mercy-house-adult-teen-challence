function toKebabCase(input: string): string {
    return input
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

export function createPageUrl(pageName: string) {
    return '/' + toKebabCase(pageName);
}