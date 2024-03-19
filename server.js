import express from 'express'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.static('public'))
app.use(express.json())

// app.use(cookieParser())

// app.get('/api/bug', (req, res) => {
//     let visitedCount = req.cookies.visitedCount || 0
//     res.cookie('visitedCount', ++visitedCount)
//     res.send(console.log('visitedCount', visitedCount))
// })

// Get Bugs(Read)
app.get('/api/bug', (req, res) => {
    console.log('req query', req.query)
    const filterBy = {
        title: req.query.title || '',
        pageIdx: req.query.pageIdx
    }

    bugService.query(filterBy).then(bugs => {
        res.send(bugs)
    })
    .catch(err => {
        loggerService.error('Cannot get bugs', err)
        res.status(400).send('Cannot get cars')
    })
})

// Create Bug (Read)
app.post('/api/bug', (req, res) => {
    console.log(req.body)
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        desc: req.body.desc
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
})

// Update Bug
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        _id: req.body._id,
        desc: req.body.desc,
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
})



// Get Bug (Read)
app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch(err => {
            loggerService.error(err)
        })
})

// Remove Bug (Delete)
app.delete('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId).then(() => res.send(bugId))
})


app.listen(3031, () => loggerService.info(`Server ready at port 3031 http://127.0.0.1:${3031}/`))