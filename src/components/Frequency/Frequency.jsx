import React from 'react'
import './Styles/Frequency.scss'

export default ({}) => {
  return (
    <div className='Frequency'>
      <img className='FrequencyImg' src={process.env.PUBLIC_URL + '/frequency.svg'} alt='frequency'/>
    </div>
  )
}
