export function isLoggedIn() {
  return !!localStorage.getItem('token')
}

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}

export function parseJWT(token) {
  try {
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return {};
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeToken();
      return {};
    }

    return payload;
  } catch (error) {
    removeToken();
    return {};
  }
}

export function saveCredentials(username, password) {
  const credentials = {
    username: username,
    password: password,
    timestamp: Date.now()
  }
  localStorage.setItem('rememberedCredentials', JSON.stringify(credentials))
}

export function getCredentials() {
  const saved = localStorage.getItem('rememberedCredentials')
  if (saved) {
    const credentials = JSON.parse(saved)
    if (Date.now() - credentials.timestamp < 7 * 24 * 60 * 60 * 1000) {
      return credentials
    } else {
      removeCredentials()
    }
  }
  return null
}

export function removeCredentials() {
  localStorage.removeItem('rememberedCredentials')
}

export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}