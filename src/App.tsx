import {router} from './routes'
import { RouterProvider } from 'react-router-dom'
import './App.css'

export function App() {
    return(

        <RouterProvider router={router}/>
    )
    
}


