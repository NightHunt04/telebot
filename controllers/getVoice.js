import axios from "axios"
import dotenv from "dotenv"
import fs from 'fs'

import { transcriptVoice } from "./transcriptVoice.js"
import { generateAnswer } from '../utils/generateAnswer.js'
import { sendMessage } from "./sendMessage.js"
import { sendVoice } from './sendVoice.js'

dotenv.config()

export const getVoice = async (fileId, chatId) => {
    try {
        const fileResponse = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`)
        const filePath = fileResponse.data.result.file_path

        const downloadUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`

        const voiceResponse = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'stream',
        })

        const writer = fs.createWriteStream(`downloads/${fileId}.ogg`)
        voiceResponse.data.pipe(writer);

        writer.on('finish', async () => {
            console.log('Voice message saved successfully.')
            writer.close()
            // fs.unlink(`./downloads/${fileId}.ogg`, (err) => {
            //     console.error(err)
            // })
            console.log('downloaded')
            const transcript = await transcriptVoice(fileId)
            console.log('transcript done')
            const answer = await generateAnswer(transcript)
            console.log('answer done')

            const responsePromise = fetch(
                'https://api.neets.ai/v1/tts',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'c0d9aeeef6f14e98ad46c8d23e24535b'
                  },
                  body: JSON.stringify({
                    text: answer,
                    voice_id: 'us-male-4',
                    params: {
                      model: 'style-diff-500'
                    }
                  })
                }
              )
            .then(response => response.arrayBuffer())
            .then(async(buffer) => {
                fs.writeFileSync(`voices/${fileId}.mp3`, Buffer.from(buffer))
                console.log('file done')
                await sendVoice(chatId, fileId)
                console.log('voice done')

                fs.unlinkSync(`downloads/${fileId}.ogg`)
                fs.unlinkSync(`voices/${fileId}.mp3`)
            })
        })

        writer.on('error', (err) => {
            console.error('Error saving the voice message:', err)
        })

    } catch (error) {
        console.error('Error processing voice message:', error)
    }
}