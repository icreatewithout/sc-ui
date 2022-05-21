//登录
export const login = '/auth/token'
// 获取验证码
export const getCode = '/auth/code'
//退出
export const logout = '/auth/logout'
// 部门资源
export const depts = '/user/dept/list'
export const treeDept = '/user/dept/tree'
export const saveDept = '/user/dept'
export const getDept = '/user/dept/'
export const deleteDept = '/user/dept/'
//用户资源
export const users = '/user/user/list'
export const saveUser = '/user/user'
export const getUser = '/user/user/'
export const deleteUser = '/user/user/'
export const resetPass = '/user/user/reset/'
export const getUserByToken = '/user/user/by/token'
export const updateAvatar = '/user/user/update/avatar/'
export const changePass = '/user/user/change/passwd'
//角色资源
export const roles = '/user/role/list'
export const allRoles = '/user/role/all'
export const saveRole = '/user/role'
export const getRole = '/user/role/'
export const deleteRole = '/user/role/'
//菜单资源
export const menus = '/user/menu/list'
export const menusByUser = '/user/menu/by/user'
export const menusByRouter = '/user/menu/by/router'
export const typeMenus = '/user/menu/type'
export const treeMenus = '/user/menu/tree'
export const saveMenu = '/user/menu'
export const getMenu = '/user/menu/'
export const deleteMenu = '/user/menu/'
//日志信息
export const logs = '/user/log/list'
export const getLog = '/user/log/'
//上传
export const upload = '/api/file/upload'
//admin server
export const admin = 'http://192.168.3.122:8670'
//zipkin
export const zipkin = '/api/admin'








