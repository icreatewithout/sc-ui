import Cookies from 'js-cookie'

const token_key = 'sc-dev-token'

export function getToken() {
    return Cookies.get(token_key)
}

export function setToken(token) {
    return Cookies.set(token_key, token, {expires: 30})
}

export function removeToken() {
    return Cookies.remove(token_key)
}

export function setByKV(key, val) {
    return Cookies.set(key, val.toString(), {expires: 30})
}

export function getByKey(key) {
    return Cookies.get(key)
}

export function removeByKey(key) {
    return Cookies.remove(key)
}
