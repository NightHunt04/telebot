import Groq from "groq-sdk"
import dotenv from "dotenv"

dotenv.config()

export const groq = new Groq(process.env.GROQ_API_KEY)