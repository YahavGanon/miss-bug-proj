const { useState, useEffect, useRef } = React
import { bugService } from "../services/bug.service.js"
import { utilService } from "../services/util.service.js"

export function BugFilter({ debounceSetMainFilter, filterByMain }) {
    const [filterBy, setFilterBy] = useState(filterByMain)
    
    useEffect(() => {
        debounceSetMainFilter.current(filterBy)
    }, [filterBy])

    function handleTxtChange(ev) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, title: ev.target.value }))
    }

    return <form>
        <label className="search-focus" htmlFor="input"><span className="fa-solid fa-magnifying-glass"></span></label>
        <input className="search-bug" id="input" type="text" onChange={handleTxtChange} value={filterBy.title} placeholder="Search bug" />
    </form>
}