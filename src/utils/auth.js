import Cookies from 'js-cookie'

const uToken = 'userToken'
const darkMode = 'dark_mode';

// 获取Token
export function getToken() {
    return Cookies.get(uToken);
}

// 设置Token，浏览器关闭时失效
export function setTokenTemp(token) {
    return Cookies.set(uToken, token)
}

// 设置Token，10天,与后端同步
export function setToken(token, expires=10) {
    return Cookies.set(uToken, token, {expires: expires})
}

// 删除Token
export function removeToken() {
    return Cookies.remove(uToken)
}

export function removeAll() {
    return Cookies.Cookies.removeAll()
}

export function setDarkMode(mode) {
    return Cookies.set(darkMode, mode, {expires: 365})
}

export function getDarkMode() {
    return !(undefined === Cookies.get(darkMode) || 'false' === Cookies.get(darkMode));
}
