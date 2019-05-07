import axios from '@/libs/api.request'
import getToken from '@/libs/util'
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
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/menu-list/',
    method: 'get'
  })
}
export const getrongzaiDetail = () => {
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/rongzai-detail/',
    method: 'get'
  })
}
export const getScripts = () => {
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-scripts/',
    method: 'get'
  })
}
export const addButton = (btnName, scriptName) => {
  const data = JSON.stringify({
    'name': btnName,
    'script': scriptName,
    'order_num': 1
  })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/add-button/',
    data,
    method: 'post'
  })
}
export const executeButton = (id) => {
  const data = JSON.stringify({
    'button_id': id
  })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/execute-button/',
    data,
    method: 'post'
  })
}
export const getExecLog = (page, pageSize) => {
  const data = JSON.stringify({
    page,
    pageSize
  })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-exec-log/',
    data,
    method: 'post'
  })
}
