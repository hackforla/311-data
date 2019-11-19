import React from 'react'
import './Styles/TimeToClose.scss'

export default ({}) => {
  return (
    <div className='TimeToClose'>
      <img className='TimeToCloseImg' src={process.env.PUBLIC_URL + '/timetoclose.svg'} alt="timetoclose"/>
    </div>
  )
}
