import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

import {
  getMenuList
} from '@/api/routers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
    menuList: []
  },
  mutations: {
    //
  },
  actions: {
    updateSideMenuList ({ state }) {
      getMenuList().then(res => {
        let menus = res.data.data
        menus.forEach((menu, index) => {
          menus[index].meta = { 'title': menu.name }
        })
        state.menuList = menus
      }).catch(err => {
        console.log(err)
      })
    }
  },
  modules: {
    user,
    app
  }
})
