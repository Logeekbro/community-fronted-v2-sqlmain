const getters = {
  token: state => state.user.token,   // token
  user: state => state.user.user,     // 用户对象
  avatarTS: state => state.user.avatarTS
}
export default getters