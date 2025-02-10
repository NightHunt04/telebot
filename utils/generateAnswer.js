import { groq } from '../config.js'
import Groq from 'groq-sdk'

import dotenv from "dotenv"

dotenv.config()

export const generateAnswer = async (message) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                {
                    "role": "system",
                    "content": "Your name is d3fault. You give sarcastic replies to the user in a short manner."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            "model": "llama3-8b-8192",
            "temperature": 0.6,
            "max_completion_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        })

        console.log(chatCompletion.choices[0].message.content)
        
        return chatCompletion.choices[0].message.content
    } catch (error) {
        console.error(error)
    }
}