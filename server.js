import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        desc: req.body.desc
    }
    bugService.save(bugToSave, loggedinUser)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(400).send('Cannot save car')
        })
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    const bugId = req.params.id
    console.log(bugId)
    bugService.remove(bugId, loggedinUser).then(() => res.send(bugId))
})

app.listen(3031, () => loggerService.info(`Server ready at port 3031 http://127.0.0.1:${3031}/`))

// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {

    const credentials = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname
    }

    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})