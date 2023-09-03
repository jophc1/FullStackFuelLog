import React from 'react'
import '@testing-library/jest-dom'
import { BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import { render, screen, fireEvent } from '@testing-library/react'
import { expect, it, describe } from'vitest'
import userEvent from '@testing-library/user-event'
import { EmployerContext, FuelLogContext } from './context.js'
import Login from './components/Login.jsx'
import EmployerDashboard from './components/employer/EmployerDashboard.jsx'
import VehicleForm from './components/employer/VehicleForm.jsx'
import VehiclesListFetch from './components/employer/VehiclesListFetch.jsx'
import LogsFetchList from './components/employer/LogsFetchList.jsx'


describe ('Login component', () => {
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

describe ('Vehicle form component', () => {
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

describe('Vehicle list fetch component', () => {
  let container

  function TestWrapper ({ getAllVehicles = vi.fn(), editVehicle = vi.fn() }) {
    const fuelContxt = {
      getAllVehicles
    }

    return (
      <FuelLogContext.Provider value={fuelContxt}>
          <BrowserRouter>
              <VehiclesListFetch />
          </BrowserRouter>
      </FuelLogContext.Provider>
    )
  }

  it ('renders the component with h3 heading', async () => {
    container = render(<TestWrapper />).container
    expect(container.querySelector('h3')).not.toBeNull()
    expect(container.querySelector('h3')).toHaveTextContent('All Vehicles')
  })

  it('calls getAllVehicles on mount', async () => {
    const mockGetAllVehicles = vi.fn()
    container = render(<TestWrapper getAllVehicles={mockGetAllVehicles} />).container
    vi.spyOn(React, 'useEffect').mockImplementationOnce(func => {
      onMount = func()
    })
    expect(mockGetAllVehicles).toHaveBeenCalled()
  })
})

describe('Log list fetch component', () => {
  let container

  function TestWrapper ({ getAllLogs = vi.fn()}) {
    const fuelContxt = {
      getAllLogs
    }

    return (
      <EmployerContext.Provider value={fuelContxt}>
          <BrowserRouter>
              <LogsFetchList />
          </BrowserRouter>
      </EmployerContext.Provider>
    )
  }

  it ('renders the component with h3 heading', async () => {
    container = render(<TestWrapper />).container
    expect(container.querySelector('h3')).not.toBeNull()
    expect(container.querySelector('h3')).toHaveTextContent('All Logs')
  })

  it('calls getAllVehicles on mount', async () => {
    const mockGetAllVehicles = vi.fn()
    container = render(<TestWrapper getAllVehicles={mockGetAllVehicles} />).container
    vi.spyOn(React, 'useEffect').mockImplementationOnce(func => {
      onMount = func()
    })
    expect(mockGetAllVehicles).toHaveBeenCalled()
  })
})

describe('Employer list fetch component', () => {
  let container

  function TestWrapper ({ getAllVehicles = vi.fn(), editVehicle = vi.fn() }) {
    const fuelContxt = {
      getAllVehicles,
      editVehicle
    }

    return (
      <FuelLogContext.Provider value={fuelContxt}>
          <BrowserRouter>
              <VehiclesListFetch />
          </BrowserRouter>
      </FuelLogContext.Provider>
    )
  }

  it ('renders the component with h3 heading', async () => {
    container = render(<TestWrapper />).container
    expect(container.querySelector('h3')).not.toBeNull()
    expect(container.querySelector('h3')).toHaveTextContent('All Vehicles')
  })

  it('calls getAllVehicles on mount', async () => {
    const mockGetAllVehicles = vi.fn()
    container = render(<TestWrapper getAllVehicles={mockGetAllVehicles} />).container
    vi.spyOn(React, 'useEffect').mockImplementationOnce(func => {
      onMount = func()
    })
    expect(mockGetAllVehicles).toHaveBeenCalled()
  })
})


