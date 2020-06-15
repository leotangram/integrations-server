const express = require('express')
const conectDB = require('./config/db')
const cors = require('cors')

const app = express()

conectDB()

app.use(cors())

app.use(express.json({ extended: true }))

const port = process.env.PORT || 4000

app.listen(port, '0.0.0.0', () => {
  console.log(`Server runing in port: ${port}`)
})
