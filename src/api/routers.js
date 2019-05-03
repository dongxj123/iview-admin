import axios from '@/libs/api.request'
import { setToken, getToken } from '@/libs/util'
export const getRouterReq = (access) => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}
export const getMenuList = () => {
  console.log('routers.js getToken:'+getToken())
  return axios.request({
    headers: {'AUTHORIZATION': 'token '+getToken()},
    url: 'rongzai/menu-list/',
    method: 'get'
  })
}