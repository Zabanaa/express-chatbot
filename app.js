'use strict';

const express           = require('express')
const request           = require('request')
const bodyParser        = require('body-parser')
const app               = express()
const port              = process.env.PORT || 3000
const PAGE_ACCESS_TOKEN = "EAAIIMpAi0IoBAFFZAZAMZCOuevxV6ykLeBTjIkG0Pwqc1XhDXGZBRKYlzXZBZAj75RgksmbcO3dSESIWQd2qBM1OunrkiPMiLgVk8JCGCFALUZCdlfgJCb7jUiRgCUsSlBhQUE1mhsOLA5e1im7m4uya8kdEIyRdSaZCAFI1qJ5F4AZDZD"

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

app.post('/webhook', (req, res) => {

    let data = req.body // What the user sends to the server

    if (data.object === 'page') {
        console.log(data)
        data.entry.forEach( entry => {
            let pageID      = entry.id
            let timeOfEvent = entry.time

            console.log(entry.messaging) // Show incoming message

            // Loop through all the messages
            entry.messaging.forEach( incomingMsg => {
                if (incomingMsg.message) {
                    receivedMessage(incomingMsg) // Parse the received message
                } else {
                    console.log("Webhook received unknown event", msg)
                }
            })
        })

        res.sendStatus(200)
    }
})

let callSendApi = messageData => {

    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          console.log("Successfully sent generic message");
        } else {
          console.error("Unable to send message.");
          console.error(response);
          console.error(error);
        }
      })
}

let sendTextMessage = (recipientId, messageText) => {
    let messageData = {
        recipient: {id: recipientId},
        message: {text: messageText}
    }
    callSendApi(messageData)
}

let receivedMessage = incomingMsg => {

    // We received a message from the user
    // We're just going to send it back for testing purposes

    let userId      = incomingMsg.sender.id // We retrieve the user's id so we can send the message back to them
    let recipientId = incomingMsg.recipient.id
    let timeOfMsg   = incomingMsg.timestamp
    let messageText = incomingMsg.text

    if (messageText) {
        sendTextMessage(userId, messageText) // send the message back to the user
    }

    // console.log(`Message received : ${message.text}`)
}

app.listen(port, () => console.log(`server listening on port ${port}`))
