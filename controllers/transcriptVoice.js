import { groq } from '../config.js'
import fs from 'fs'
import dotenv from "dotenv"
import Groq from 'groq-sdk'

dotenv.config()

export const transcriptVoice = async (fileName) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(`downloads/${fileName}.ogg`),
            model: "whisper-large-v3",
            response_format: "verbose_json",
          })
          console.log(transcription.text)
          return transcription.text
    } catch (err) {
        console.error(err)
    }
}

// transcriptVoice('AwACAgUAAxkBAAIBTGeqLIC_xOg4tNosXrzPHh26nlpvAAJ1EwACiqFQVawNDjONgiufNgQ')