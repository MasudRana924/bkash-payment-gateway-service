const express = require('express')
const mongoose = require('mongoose')
const body_parser = require('body-parser')
const dotEnv = require('dotenv')
const cors = require('cors')
const session = require('express-session');
const app = express()

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
dotEnv.config()
app.use(body_parser.json())

app.use('/api', require('./routes'))

const db = async()=>{
    try {
        await mongoose.connect(process.env.db_url)
        console.log('db connect')
    } catch (error) {
        
    }
}
db()
const port = process.env.PORT

app.get('/', (req, res) => res.send('server is running'))

app.listen(port, () => console.log(`bKash PGW app listening on port ${port}!`))