import {createStore} from 'vuex'
import user from "./user";
import menu from "./menu";

const getters = {
    token: state => state.user.token,
    id: state => state.user.id,
    name: state => state.user.name,
    info: state => state.user.info,
    auth: state => state.user.auth,
    font: state => state.user.font,
    expand: state => state.menu.expand,
    tags: state => state.menu.tags,
}

const store = createStore({
    modules: {
        user,
        menu
    },
    getters
})

export default store
