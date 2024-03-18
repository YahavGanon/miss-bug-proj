import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()
// Get Bugs(Read)
app.get('/api/bug', (req, res) => {
    bugService.query().then(bugs => {
        res.send(bugs)
    })
})

// Save Bug (Read)
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        _id: req.query._id
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
})



// Get Bug (Read)
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId).then(bug => res.send(bug))
})

// Remove Bug (Delete)
app.get('/api/bug/:id/remove', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId).then(() => res.send(bugId))
})


app.listen(3031, () => console.log(`Server ready at port 3031 http://127.0.0.1:${3031}/`))