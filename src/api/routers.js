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

export const addMenu = (addMenuParam) => {
  const data = JSON.stringify(addMenuParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/add-menu/',
    data,
    method: 'post'
  })
}

export const editMenu = (editMenuParam) => {
  const data = JSON.stringify(editMenuParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/update-menu/',
    data,
    method: 'post'
  })
}
// 删除菜单
export const removeMenu = (id) => {
  const data = JSON.stringify({
    'id': id
  })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/remove-menu/',
    data,
    method: 'post'
  })
}
export const getDataByMenu = (id) => {
  const data = JSON.stringify({
    'id': id
  })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-data-by-menu/',
    data,
    method: 'post'
  })
}
export const addSysUser = (addSysUserParam) => {
  const data = JSON.stringify(addSysUserParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/add-sys-user/',
    data,
    method: 'post'
  })
}

export const geSysUserList = () => {
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-sys-user-list/',
    method: 'get'
  })
}
export const resetPassword = (id) => {
  const data = JSON.stringify({ id: id })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/reset-password/',
    data,
    method: 'post'
  })
}
export const removeSysUser = (id) => {
  const data = JSON.stringify({ id: id })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/remove-sys-user/',
    data,
    method: 'post'
  })
}
export const changePassword = (changePasswordParam) => {
  const data = JSON.stringify(changePasswordParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/change-password/',
    data,
    method: 'post'
  })
}
export const geAllMenuList = () => {
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-all-menu-list/',
    method: 'get'
  })
}
export const getUserMenuids = (id) => {
  const data = JSON.stringify({ id: id })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-user-menuids/',
    data,
    method: 'post'
  })
}
export const setUserMenuList = (setUserMenuListParam) => {
  const data = JSON.stringify(setUserMenuListParam)
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/set-user-menu-list/',
    data,
    method: 'post'
  })
}
export const deleteButton = (id) => {
  const data = JSON.stringify({ id: id })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/delete-button/',
    data,
    method: 'post'
  })
}
export const getButtonsByMenu = (id) => {
  const data = JSON.stringify({ id: id })
  return axios.request({
    headers: { 'AUTHORIZATION': 'token ' + getToken() },
    url: 'rongzai/get-buttons-by-menu/',
    data,
    method: 'post'
  })
}
