
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'
// _createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}


function query(filterBy = getDefaultFilter()) {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)

}

function getById(bugId) {
    // return storageService.get(STORAGE_KEY, bugId)
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .catch(err => {
            console.log('err', err)
        })
}

function remove(bugId) {
    // return storageService.remove(STORAGE_KEY, bugId)
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
    // const url = BASE_URL + 'save'
    // let queryParams = `?title=${bug.title}&severity=${bug.severity}`
    // if (bug._id){
    //     queryParams += `&desc=${bug.desc}&_id=${bug._id}`
    // }
    // return axios.get(url + queryParams).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '' }
}





// function _createBugs() {
//     let bugs = utilService.loadFromStorage(STORAGE_KEY)
//     if (!bugs || !bugs.length) {
//         bugs = [
//             {
//                 title: "Infinite Loop Detected",
//                 severity: 4,
//                 _id: "1NF1N1T3"
//             },
//             {
//                 title: "Keyboard Not Found",
//                 severity: 3,
//                 _id: "K3YB0RD"
//             },
//             {
//                 title: "404 Coffee Not Found",
//                 severity: 2,
//                 _id: "C0FF33"
//             },
//             {
//                 title: "Unexpected Response",
//                 severity: 1,
//                 _id: "G0053"
//             }
//         ]
//         utilService.saveToStorage(STORAGE_KEY, bugs)
//     }




