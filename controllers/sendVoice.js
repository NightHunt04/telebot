import axios from "axios"
import dotenv from "dotenv"
import FormData from "form-data"

dotenv.config()

export const sendVoice = async (messageObj) => {
    try {
        const chatId = messageObj.chat.id
        const userMessage = messageObj.text

        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('voice', fs.createReadStream(`../voices/${chatId}.mp3`))

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