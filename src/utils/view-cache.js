import Cookies from 'js-cookie'

const viewCache = "articleId"

export function setViewCache(id, expires=10){
    Cookies.set(viewCache, id, {expires: expires})
}

export function getViewCache(){
    return Cookies.get(viewCache)
}