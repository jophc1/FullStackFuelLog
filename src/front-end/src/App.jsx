import { useReducer, useState } from 'react'
import { reducer, initialState } from './reducer.js'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import './App.css'

function App() {
  const [store, dispatch] = useReducer(reducer, initialState)

  return <>
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  </>
}

export default App
