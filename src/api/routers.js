import axios from '@/libs/api.request'
import { getToken } from '@/libs/util'
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
export const addButton = (addButtonParam) => {
  const data = JSON.stringify(addButtonParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/add-button/',
    data,
    method: 'post'
  })
}
export const editButton = (editButtonParam) => {
  const data = JSON.stringify(editButtonParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/update-button/',
    data,
    method: 'post'
  })
}
export const executeButton = (executeButtonParam) => {
  const data = JSON.stringify(executeButtonParam)
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

export const getServerList = () => {
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/server-list/',
    method: 'get'
  })
}

export const operateServer = (operateServerParam) => {
  const data = JSON.stringify(operateServerParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/operate-server/',
    data,
    method: 'post'
  })
}
