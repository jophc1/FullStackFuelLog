import express from 'express'
import path from 'path'
import cors from 'cors'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

// specify the static file folder
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist')))

// get all routes

app.get('*', (req, res) => {
  console.log(path.join(__dirname, '/dist', '/index.html'))
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})



app.listen(5173)

