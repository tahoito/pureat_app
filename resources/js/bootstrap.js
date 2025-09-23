import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = import.meta.env.VITE_APP_URL ?? window.location.origin;

console.log("VITE_APP_URL", import.meta.env.VITE_APP_URL);
console.log("window.location.origin", window.location.origin);
