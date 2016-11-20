const express       = require('express')
const request       = require('request')
const bodyParser    = require('body-parser')
const app           = express()
const port          = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send("Hello Bruv"))

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === 'zabana') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token')
    }
})

app.listen(port, () => console.log(`server listening on port ${port}`))
