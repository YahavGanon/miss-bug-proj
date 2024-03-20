import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

function query(filterBy = getDefaultFilter()) {
    return storageService.query(STORAGE_KEY)
}

function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}

function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&severity=${bug.severity}`
    if (bug._id) {
        queryParams += `&desc=${bug.desc}&_id=${bug._id}`
    }
    return axios.get(url + queryParams).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '' }
}
