import Cookies from 'js-cookie'

/**
 * 记录用户浏览过的文章id
 */

const viewCache = "articleId"
// 默认cookie过期时间
const defaultExpire = 365


export function setViewCache(id, expires=defaultExpire){
    Cookies.set(viewCache, id, {expires: expires})
}

export function getViewCache(){
    return Cookies.get(viewCache)
}