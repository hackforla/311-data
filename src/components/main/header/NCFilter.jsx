import React from 'react';
import { COUNCILS } from '../../common/CONSTANTS';

const NCFilter = ({
  isPrimary,
  selectedNC,
  onChange
}) => {
  const style = isPrimary === true ? 'NCFilterPrimary' : 'NCFilterSecondary';

  return (
    <div className={style}>
      <select className="NCFilterDropdown" onChange={onChange}>
        {COUNCILS.map((nc) => (
          <option key={nc} value={nc}>
            {nc}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NCFilter;
