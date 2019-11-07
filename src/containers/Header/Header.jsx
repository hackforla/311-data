import React from 'react'
import './Styles/Header.scss'
import NCFilter from '../../components/common/NCFilter.jsx'
import DataPicker from '../../components/common/dataPicker.jsx'
import Legend from '../../components/common/Legend.jsx'

export default ({}) => {
  return (
    <div className='Header'>
      <NCFilter isPrimary={true}/>
      <NCFilter isPrimary={false}/>
      <DataPicker/>
      <Legend/>
    </div>)
}
