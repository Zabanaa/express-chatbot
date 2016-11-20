const express       = require('express')
const request       = require('request')
const bodyParser    = require('body-parser')
const app           = express()
const port          = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send("Hello Bruv"))

app.listen(port, () => console.log(`server listening on port ${port}`))
