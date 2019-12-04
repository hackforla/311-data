import React from 'react'
import constants from '../../common/CONSTANTS.js';

export default ({
  isPrimary,
  selectedNC,
  onChange
 }) => {

  const style = isPrimary === true ? 'NCFilterPrimary' : 'NCFilterSecondary'
  return (
    <div className={style}>
      <select className="NCFilterDropdown" onChange={onChange}>
        {constants.COUNCILS.map((nc, idx) => (<option key={nc} value={nc}>{nc}</option>))}
      </select>
    </div>
  )
}
