import {getToken, setToken, removeToken, getByKey, setByKV, removeByKey} from './cookie'
import {get, post} from '../request/request'
import {login, getUser, logout, getUserByToken} from '../request/api'

const user = {
    state: {
        token: getToken(),
        id: getByKey('id'),
        name: getByKey('name'),
        info: getByKey('info'),
        auth: getToken() !== undefined,
        font: getByKey('font') !== undefined ? getByKey('font') : 18
    },

    mutations: {
        update(state, [key, val]) {
            state[key] = val
        }
    },

    actions: {

        Login({commit}, data) {
            return new Promise((resolve, reject) => {
                post(login, data).then(res => {
                    setToken(res.data)
                    commit('update', ['token', res.data])
                    commit('update', ['auth', true])
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取并缓存用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                get(getUserByToken).then(res => {
                    setByKV('id', res.data.id)
                    setByKV('name', res.data.userName)
                    setByKV('info', JSON.stringify(res.data))
                    commit('update', ['id', res.data.id])
                    commit('update', ['info', JSON.stringify(res.data)])
                    commit('update', ['name', res.data.userName])
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        Logout({commit, state}) {
            return new Promise((resolve, reject) => {
                commit('update', ['token', null])
                get(logout).then(res => {
                    removeByKey('id')
                    removeByKey('name')
                    removeByKey('info')
                    removeToken()
                    commit('update', ['auth', false])
                    commit('update', ['info', null])
                    commit('update', ['id', null])
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })

            })

        }
    }
}

export default user
