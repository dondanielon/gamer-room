import express from 'express'
import cors from 'cors'
import cookies from 'cookie-parser'
import routes from './routes/routers'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

app.use(cors({ credentials: true, origin: CLIENT_URL }));
app.use(express.json());
app.use(cookies())
app.use('/api', routes)

export default app