import store from 'store'
const USER_INFO = 'user_info';
export default {
    //保存用户信息
    saveUser(user){
        // localStorage.setItem(USER_INFO,JSON.stringify(user))
        store.set(USER_INFO,user)
    },
    //取出用户信息
    getUser(){
      // return JSON.parse(localStorage.getItem(USER_INFO) || '{}')
        return store.get(USER_INFO) || {}
    },
    //删除用户信息
    removeUser(){
      // localStorage.removeItem(USER_INFO)
        store.remove(USER_INFO);
    }
}
