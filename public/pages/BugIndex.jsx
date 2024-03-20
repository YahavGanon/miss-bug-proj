import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/bugFilter.jsx'
import { BugSort } from '../cmps/BugSort.jsx'
import { utilService } from '../services/util.service.js'


const { useState, useEffect, useRef } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterByMain, setMainFilter] = useState(bugService.getDefaultFilter())
    const debounceSetMainFilter = useRef(utilService.debounce(setMainFilter, 500))

    useEffect(() => {
        loadBugs()
    }, [filterByMain])

    function loadBugs() {
        bugService.query(filterByMain)
            .then((bugs) => {
                setBugs(bugs)
            })
    }

    function onChangePage(diff) {
        if(filterByMain.pageIdx === undefined) return
        let nextPageIdx = filterByMain.pageIdx + diff
        if(nextPageIdx < 0) nextPageIdx = 0
        setMainFilter(prevFilter => ({...prevFilter, pageIdx: nextPageIdx}))
    }

    function onTogglePagination(){
        setMainFilter(prevFilter => ({
            ...prevFilter,
            pageIdx: filterByMain.pageIdx === undefined ? 0 : undefined
        }))
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            desc: prompt('Bug description?'),
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <section className='pagination'>
                <button onClick={() => onChangePage(-1)}>-</button>
                <span>{filterByMain.pageIdx +1 || 'No pagination'}</span>
                <button onClick={() => onChangePage(1)}>+</button>
                <button onClick={onTogglePagination}>Toggle Pagination</button>
            </section>
            <BugFilter filterByMain={filterByMain} debounceSetMainFilter={debounceSetMainFilter} />
            <BugSort bugs={bugs} loadBugs={loadBugs} setBugs={setBugs} />
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
