import express from 'express'
import * as dotenv from 'dotenv'
import { dbConnection } from './databases/dbConnection.js'
import { init } from './src/modules/index.route.js'


dotenv.config({ quiet: true })
const app = express()

app.set('query parser', 'extended')
app.use(express.json())


init(app)
dbConnection()

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is Runnig....`)
})

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection', err)
})