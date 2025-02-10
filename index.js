import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { sendMessage } from "./controllers/SendMessage.js"
import { groq } from "./config.js"
import { sendVoice } from "./controllers/sendVoice.js"
import fs from "fs"
import FormData from "form-data"
import axios from "axios"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Server is running...'))

app.post('*', async (req, res) => {
    console.log(req.body.message)
    if (req.body.message) {
        const messageText = req.body.message.text

        if (messageText.startsWith('/')) {
            const text = messageText.slice(1)

            if (text === 'start') {
                sendMessage(req.body.message, 'go to sleep')
                return res.send('ok').status(200)
            } 
            else if (text === 'voice') {
                const formData = new FormData();
                formData.append('chat_id', req.body.message.chat.id);
                formData.append('voice', fs.createReadStream('v.mp3'));

                const config = {
                    method: 'post',
                    url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVoice`,
                    headers: {
                    ...formData.getHeaders(),
                    },
                    data: formData,
                };

                const response = await axios(config);
                return res.send('ok').status(200)
            }
        } else {
            const chatCompletion = await groq.chat.completions.create({
                "messages": [
                    {
                        "role": "system",
                        "content": "Your name is d3fault. You give sarcastic replies to the user in a short manner."
                    },
                    {
                        "role": "user",
                        "content": messageText
                    }
                ],
                "model": "llama3-8b-8192",
                "temperature": 1,
                "max_completion_tokens": 1024,
                "top_p": 1,
                "stream": false,
                "stop": null
            })
            
            sendMessage(req.body.message, chatCompletion.choices[0].message.content)
            return res.send('ok').status(200)
        }
    }
})

// set webhook
// https://api.telegram.org/bot7169770949:AAH4ZTtSk6658kT2wBVrKyWIgtq5rDhKRhk/setWebhook?url=https://9a4f-150-107-241-34.ngrok-free.app/
// https://api.telegram.org/bot7169770949:AAH4ZTtSk6658kT2wBVrKyWIgtq5rDhKRhk/deleteWebhook?drop_pending_updates=true

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))