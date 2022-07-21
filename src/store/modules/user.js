import { getUserInfo, login, logout } from "@/api/auth/auth";
import { getToken, setToken, setTokenTemp, removeToken } from "@/utils/auth";

const state = {
  token: getToken(), // token
  user: "", // 用户对象
  avatarTS: Date.now() // 头像更新的时间戳，用于解决缓存问题
};

const mutations = {
  SET_TOKEN_STATE: (state, token) => {
    state.token = token;
  },
  SET_USER_STATE: (state, user) => {
    state.user = user;
  },
  SET_AVATAR_STATE: (state, ts) => {
    state.avatarTS = ts
  }
};

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { name, pass, rememberMe } = userInfo;
    return new Promise((resolve, reject) => {
      login({ account: name.trim(), password: pass })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN_STATE", data.value);
          if(rememberMe){
            setToken(data.value);
          }
          else{
            setTokenTemp(data.value)
          }
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then((response) => {
          const { data } = response;
          if (!data) {
            commit("SET_TOKEN_STATE", "");
            commit("SET_USER_STATE", "");
            removeToken();
            resolve();
            reject("Verification failed, please Login again.");
          }
          data.avatar +=  "?" + state.avatarTS
          commit("SET_USER_STATE", data);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout()
        .then((response) => {
          console.log(response);
          commit("SET_TOKEN_STATE", "");
          commit("SET_USER_STATE", "");
          removeToken();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  updateAvatar({ commit }, ts){
    commit("SET_AVATAR_STATE", ts)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
