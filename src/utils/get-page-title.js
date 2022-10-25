const title = 'DB论坛'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}
