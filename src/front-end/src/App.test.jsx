import '@testing-library/jest-dom'
import { BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { useReducer } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { expect, it, describe } from'vitest'
import userEvent from '@testing-library/user-event'
import { EmployerContext, FuelLogContext } from './context.js'
import { reducer, initialState } from "./reducer.js"
import Login from './components/Login.jsx'
import EmployerDashboard from './components/employer/EmployerDashboard.jsx'
import VehicleForm from './components/employer/VehicleForm.jsx'
import API_URL from './config.js'

// setup userEvent function
function setup(component) {
  return {
    user: userEvent.setup(),
    ...render(component),
  };
}

describe ('/ route', () => {
  let container
  function TestWrapper ({ loginAccess = vi.fn() }) {
      const fuelContxt = {
        loginAccess,
        setRenderLoadingGif: vi.fn()
      }
      return (
        <FuelLogContext.Provider value={fuelContxt}>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </FuelLogContext.Provider>
      )
    }

    it('renders the login form', () => {
      container = render(<TestWrapper />).container
      expect(container.querySelector('h3')).not.toBeNull()
      expect(container.querySelector('h3')).toHaveTextContent('Company Fuel Log')
      expect(container.querySelector('input')).not.toBeNull()
      expect(container.querySelector('#loginButton')).toHaveValue('LOGIN')
    })

    it('loginAccess is called when \'LOGIN\' is clicked', async () => {
      const mockLoginAccess = vi.fn()
      container = render(<TestWrapper loginAccess={mockLoginAccess} />).container
      const loginButton = screen.getByRole('button')
      await userEvent.click(loginButton)
      expect(mockLoginAccess).toHaveBeenCalled()
    })
})

describe ('/employer/dashboard/vehicle/new', () => {
    let container

    function TestWrapper ({ postUpdateVehicle = vi.fn(), backButton =vi.fn() }) {
      const fuelContxt = {
        backButton
      }

      const employerContext = {
        postUpdateVehicle
      }
      return (
        <FuelLogContext.Provider value={fuelContxt}>
          <EmployerContext.Provider value={employerContext}>
            <BrowserRouter>
                <VehicleForm />
            </BrowserRouter>
          </EmployerContext.Provider>
        </FuelLogContext.Provider>
      )
    }

    it('postUpdateVehicle is called when form is submitted', async () => {
      const mockPostUpdateVehicle = vi.fn()
      container = render(<TestWrapper postUpdateVehicle={mockPostUpdateVehicle} />).container

      // const returnObj = {
      //   status: 500,
      //   json: async () => nameNationalizeResponse,
      // }
    
      // windowFetchSpy = vi.spyOn(window, 'fetch')
      
      // windowFetchSpy.mockReturnValue(returnObj)

      // let onChnageValue = {
      //   target: {
      //     value: 'Test'
      //   }
      // }

      expect(container.querySelector('h3')).not.toBeNull()
      expect(container.querySelector('h3')).toHaveTextContent('Add Vehicle')
  
      // const input = screen.getByTestId('make')
      // fireEvent.change(input, onChnageValue)
      // await userEvent.type(input, 'Test')
      // expect(input.value).toBe('Test')

      const button = screen.getByText('Submit')
      await userEvent.click(button)
      expect(mockPostUpdateVehicle).toHaveBeenCalled()
    })

    it ('backButton is called when back button is clicked', async () => {
      const mockBackButton = vi.fn()
      container = render(<TestWrapper backButton={mockBackButton} />).container
      const backButton = screen.getByTestId('back')
      await userEvent.click(backButton)
      expect(mockBackButton).toHaveBeenCalled()
    })
})


