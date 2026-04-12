export const getAccessToken = () => {
    const tokenData = sessionStorage.getItem('token');
    if (!tokenData) return null;
    try {
        return JSON.parse(tokenData);
    } catch (e) {
        return tokenData;
    }
};