const { useState,useEffect } = React

export function BugSort({ bugs, loadBugs, setBugs }) {
    const [sortedBugs, setSortedBugs] = useState(bugs)
    const [isDescending, setIsDescending] = useState (true)
    // console.log(isDescending)

    // console.log(sortedBugs)
    const gSort = isDescending ? 1 : -1
    // console.log(gSort)

    useEffect(() => {
        setBugs(sortedBugs)
    }, [sortedBugs])

    function setDefaultSort(ev) {
        const sortingCriteria = ev.target.value
        // console.log(sortingCriteria)
        let sortedArray = [...bugs]
    
        if (sortingCriteria === 'title') {
            sortedArray.sort((a, b) => (a.title.length - b.title.length) * gSort)
        } else if (sortingCriteria === 'severity') {
            sortedArray.sort((a, b) => (a.severity - b.severity) * gSort)
        } else if (sortingCriteria === 'createdAt') {
            sortedArray.sort((a, b) => (a.createdAt - b.createdAt) * gSort)
        }
    
        setSortedBugs(sortedArray)
    }

    return (
        <div className="bug-sort">
            <select onChange={setDefaultSort} className="sort-by">
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Creation Time</option>
            </select>
            <label>
                <input className="sort-desc" type="checkbox" onChange={() => setIsDescending(!isDescending)} />
                Descending
            </label>
        </div>
    )
}