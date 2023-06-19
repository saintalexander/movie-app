import React, { useState } from 'react'
import './App.css'


import Advanced from './Advanced'


function App () {
  const [showAdvanced, setShowAdvanced] = useState(true)

  return (
    <div className='app'>
      <Advanced /> 
     
    </div>
  )
}

export default App