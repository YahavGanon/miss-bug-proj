import { utilService } from "./util.service.js"
import { loggerService } from './logger.service.js'
import fs from 'fs'

const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    remove,
    save,
}

function query(filterBy) {
    let bugsToReturn = bugs

    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regex.test(bug.title))
    }

    if (filterBy.pageIdx !== undefined) {
        const pageIdx = +filterBy.pageIdx
        const startIdx = pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugsToReturn)
}

function getById(id) {
    const bug = bugs.find(bug => bug._id === id)
    if (!bug) return Promise.reject('bug does not exist')
    return Promise.resolve(bug)
}

function remove(id, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === id)
    const bug = bugs[bugIdx]

    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()

}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(_bug => _bug._id === bug._id)

        if (!loggedinUser.isAdmin &&
            bugIdx.owner._id !== loggedinUser._id) {
            return Promise.reject('Not your car')
        }

        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.owner = loggedinUser
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}