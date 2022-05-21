import {getByKey, setByKV, removeByKey, setToken, removeToken} from './cookie'

const key = "expand";
const key1 = "tags";

const tag = [
    {id: '0', name: '首页', type: '', path: '/',  closable: true},
]

const menu = {
    state: {
        expand: getByKey(key) === undefined ? false : getByKey(key) === 'true',
        tags: getByKey(key1) === undefined ? tag : getByKey(key1)
    },
    mutations: {
        update(state, [key, val]) {
            state[key] = val
        }
    },

    actions: {
        SetExpand({commit}, expand) {
            return new Promise((resolve, reject) => {
                commit('update', [key, expand])
                setByKV(key, expand)
                resolve()
            })
        },
        SetTag({commit}, tag) {

            return false

            let tags = this.state.menu.tags
            console.log(tags)
            for (let i in tags) {
                console.log(tags[i])
            }
            tags.push(tag)
            return new Promise((resolve, reject) => {
                commit('update', [key1, tags])
                removeByKey(key1)
                setByKV(key1, tags)
                resolve()
            })
        },
        CloseTag({commit}, index) {
            let tags = this.state.tags
            tags = tags.splice(index, 1)

            return new Promise((resolve, reject) => {
                commit('update', [key1, tags])
                setByKV(key1, tags)
                resolve()
            })
        }
    }
}

export default menu
