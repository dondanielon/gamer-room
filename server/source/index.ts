import app from './API/app'
import { databaseConnection } from './database/config'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    await databaseConnection()
    console.log(`Server listening on port ${PORT}`)
    console.log(new Date('1997-04-14'))
})