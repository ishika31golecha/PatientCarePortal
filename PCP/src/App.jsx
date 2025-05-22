import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import CameraFeed from './components/CameraFeed'
import NewReg from './pages/NewReg'
import RegistrationSuccess from './pages/RegistrationSuccess'
import PatientDisplay from './pages/PatientDisplay'
import MedicalInformationForm from './pages/MedicalInformationForm'

const App = () => {
  return (
    <div className='w-full overflow-hidden'>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/camera-feed' element={<CameraFeed/>}/>
        <Route path='/new-reg' element={<NewReg/>}/>
        <Route path='/registration-success' element={<RegistrationSuccess/>}/>
        <Route path='/patient/:regNumber' element={<PatientDisplay/>}/>
        <Route path='/patient/:regNumber/medical-form' element={<MedicalInformationForm/>}/>
      </Routes>
      
    </div>
  )
}

export default App
