import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export const sendMessage = async (chatId, answer) => {
    try {
        await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            params: {
                chat_id: chatId,
                text: answer
            }
        })
    } catch (error) {
        console.error(error)
    }
}