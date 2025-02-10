import axios from "axios"
import dotenv from "dotenv"
import FormData from "form-data"
import fs from 'fs'

dotenv.config()

export const sendVoice = async (chatId, fileName) => {
    try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('voice', fs.createReadStream(`voices/${fileName}.mp3`))

        const config = {
            method: 'post',
            url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVoice`,
            headers: {
            ...formData.getHeaders(),
            },
            data: formData,
        };

        await axios(config)
    } catch (error) {
        console.error(error)
    }
}