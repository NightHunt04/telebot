import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export const sendMessage = async (messageObj, text) => {
    try {
        const chatId = messageObj.chat.id

        await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            params: {
                chat_id: chatId,
                text
            }
        })
    } catch (error) {
        console.error(error)
    }
}