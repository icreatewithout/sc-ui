import axios from 'axios'
import {getToken} from "../store/cookie"
import jsSHA from "jssha/sha256";
import {ElLoading, ElMessage} from "element-plus";
import store from "../store/store";
import router from "../router/router";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const instance = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_BASE_API,
    // 超时
    timeout: 60000
})

instance.interceptors.request.use(function (config) {
    if (getToken() !== undefined && getToken() !== null && getToken() !== 'undefined') {
        config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.data.code === 401) {
        return store.dispatch('Logout').then(() => {
            router.push("/login").then(() => {
                location.reload()
            })
        })
    }
    return Promise.reject(ElMessage.error(error.response.status + ':' + error.response.statusText))
});

function request(url, data, method, resolve, reject) {
    const key1 = import.meta.env.VITE_APP_ID;
    const key2 = import.meta.env.VITE_SECRET_KEY
    let d = handlerData(data, key1, key2)

    new instance({
        method: method,
        url: url,
        data: d
    }).then(response => {
        if (response.data.code === 200) {
            resolve(response.data)
        } else if (response.data === '') {
            resolve()
        } else {
            resolve(ElMessage.error(response.data.message))
        }
    })
}

function get_request(url, data, method, resolve, reject) {
    const key1 = import.meta.env.VITE_APP_ID;
    const key2 = import.meta.env.VITE_SECRET_KEY
    data = handlerData(data, key1, key2)
    new instance({
        method: method,
        url: url,
        params: data
    }).then(response => {
        if (response.data.code === 200) {
            resolve(response.data)
        } else if (response.data === '') {
            resolve()
        } else {
            resolve(ElMessage.error(response.data.message))
        }
    })
}


export function get(url, data) {
    return new Promise((resolve, reject) => {
        get_request(url, data, 'get', resolve, reject)
    })
}

export function post(url, data) {
    return new Promise((resolve, reject) => {
        request(url, data, 'post', resolve, reject)
    })
}

export function put(url, data) {
    return new Promise((resolve, reject) => {
        request(url, data, 'put', resolve, reject)
    })
}

export function del(url, data) {
    return new Promise((resolve, reject) => {
        request(url, data, 'delete', resolve, reject)
    })
}

function handlerData(data, key1, key2) {
    if (data == null) {
        data = {}
    }
    data['appid'] = key1
    data['timestamp'] = new Date().getTime().toString()
    data['randomStr'] = generateUUID()

    let keys = Object.keys(data).sort();
    let str = ''
    let param = {}
    for (let i in keys) {
        if (keys[i] === "signature") {
            continue
        }
        if (data[keys[i]] === null || data[keys[i]] === '' || data[keys[i]] === undefined) {
            continue
        }
        param[keys[i]] = data[keys[i]]
        str = str + keys[i] + '=' + data[keys[i]] + '&'
    }
    let hmac = new jsSHA("SHA-256", "TEXT")
    hmac.update(str + key2)
    param['signature'] = hmac.getHash('HEX')
    return param
}


function generateUUID() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("")
}
