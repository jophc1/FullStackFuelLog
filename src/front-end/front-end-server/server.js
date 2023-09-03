import express from 'express'
import path from 'path'
import cors from 'cors'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

// specify the static file folder
app.use(cors())
app.use(express.static(path.join(__dirname, '../dist')))


// all app routes are sent index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

// employee routes

app.get('/employee/dashboard/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employee/dashboard/new/log/all', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

// employer routes

app.get('/employer/dashboard/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/all/vehicles', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/all/logs', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/all/employees', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/all/logs/reviews', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/all/vehicles/edit/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.get('/employer/dashboard/vehicle/new', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

// all other routes are sent 404.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', '404.html'))
})



app.listen(5173)

