const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')

const app = express()

// ✅ CORRECT CORS - Your actual frontend URL
app.use(cors({
    origin: [
        'https://pasoweto-frontend-fmqy.onrender.com',  // ✅ YOUR ACTUAL FRONTEND
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.FRONTEND_URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api", router)

const PORT = process.env.PORT || 8080

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("connected to DB")
        console.log("Server is running on port " + PORT)
    })
})