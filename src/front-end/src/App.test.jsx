import '@testing-library/jest-dom'
import { BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { useReducer } from 'react'
import { render, screen } from '@testing-library/react'
import { expect, it, describe } from'vitest'
import userEvent from '@testing-library/user-event'
import EmployeeHome from './components/employee/EmployeeHome.jsx'
import { FuelLogContext } from './context.js'
import { reducer, initialState } from "./reducer.js"
import Login from './components/Login.jsx'

// setup userEvent function
function setup(component) {
  return {
    user: userEvent.setup(),
    ...render(component),
  };
}


describe ('App Component', () => {
  let container
  beforeEach(() => {
    container = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    ).container
  })

  it('renders the Login Page', () => {
    expect(container.querySelector('h3')).not.toBeNull()
    expect(container.querySelector('h3')).toHaveTextContent('Company Fuel Log')
    expect()
  })
})

describe ('Login Component', () => {
  let container
  beforeEach(() => {
    const fuelContxt = {
      loginAccess: vi.fn(),
      setRenderLoadingGif: vi.fn()
    }

    container = render(
      <FuelLogContext.Provider value={fuelContxt}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
      </FuelLogContext.Provider>
    ).container
  })

  it('renders the Login Page', () => {
    expect(container.querySelector('h3')).not.toBeNull()
    expect(container.querySelector('h3')).toHaveTextContent('Company Fuel Log')
  })

  it ('tries to login without any input in the fields, error modal should render', async () => {
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('#loginButton')).toHaveValue('LOGIN')

    await userEvent.click(screen.getByText('LOGIN'))

    expect(container.querySelector('.error'))
  })
})

