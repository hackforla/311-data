import React, { useState } from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import SelectAllItem from './SelectAllItem';
import FlatMultiSelect from './FlatMultiSelect';

const SelectGroup = ({
  name,
  items,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="select-group">
      <span
        className={clx('toggle-button', { open })}
        role="button"
        onClick={() => setOpen(!open)}
        onKeyDown={e => e.keyCode === 13 && setOpen(!open)}
        tabIndex={0}
        aria-label={name}
      />
      <div className="select-group-content">
        <SelectAllItem
          text={`${name} (${items.length})`}
          items={items}
          onChange={onChange}
        />
        { open && (
          <FlatMultiSelect
            items={items}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default SelectGroup;

SelectGroup.propTypes = {
  name: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SelectGroup.defaultProps = {
  items: [],
  onChange: () => null,
};
