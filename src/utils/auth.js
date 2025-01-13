export const getAuthTokens = () => {
  const tokens = {
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    token_type: localStorage.getItem('token_type') || 'Bearer'
  };
  
  console.log('GET AUTH TOKENS:', tokens);
  return tokens;
};

export const setAuthTokens = ({ access_token, refresh_token, token_type }) => {
  console.log('SETTING TOKENS:', { 
    access_token: access_token ? 'PRESENT' : 'MISSING',
    refresh_token: refresh_token ? 'PRESENT' : 'MISSING',
    token_type 
  });

  // Защита от быстрого удаления
  const storageSet = (key, value) => {
    try {
      localStorage.setItem(key, value);
      
      // Проверка через микротайминг
      setTimeout(() => {
        const storedValue = localStorage.getItem(key);
        if (!storedValue) {
          console.error(`TOKEN ${key} DISAPPEARED`);
          localStorage.setItem(key, value);
        }
      }, 50);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  storageSet('access_token', access_token);
  storageSet('refresh_token', refresh_token);
  storageSet('token_type', token_type || 'Bearer');
};

export const clearAuthTokens = () => {
  console.log('CLEARING ALL TOKENS');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_type');
};