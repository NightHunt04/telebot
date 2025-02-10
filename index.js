import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { sendMessage } from "./controllers/sendMessage.js"
import { getVoice } from "./controllers/getVoice.js"
import { transcriptVoice } from "./controllers/transcriptVoice.js"
import { generateAnswer } from './utils/generateAnswer.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('Server is running...'))

app.post('*', async (req, res) => {
    console.log(req.body.message)
    if (req.body.message) {
        const message = req.body.message

        if (message.text) {
            const messageText = message.text

            if (messageText.startsWith('/')) {
                const text = messageText.slice(1)

                if (text === 'start') {
                    sendMessage(message.chat.id, 'go to sleep')
                    return res.send('ok').status(200)
                } 
                else if (text === 'voice') {
                    return res.send('ok').status(200)
                }
            } else {
                const answer = await generateAnswer(messageText)
                sendMessage(message.chat.id, answer)
                console.log(req.body)
                return res.send('ok').status(200)
            }
        } else if(message.voice) {
            const fileId = message.voice.file_id
            const chatId = message.chat.id
            await getVoice(fileId, chatId)
            return res.send('ok').status(200)
        }
    }
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

export default app