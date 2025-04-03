export function isAuthenticated(): boolean {
    return !!localStorage.getItem('apiKey');
}
