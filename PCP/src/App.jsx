import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CameraFeed from './components/CameraFeed'
import NewReg from './pages/NewReg'

const App = () => {
  return (
    <div className='w-full overflow-hidden'>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/camera-feed' element={<CameraFeed/>}/>
        <Route path='/new-reg' element={<NewReg/>}/>
      </Routes>
      
    </div>
  )
}

export default App
