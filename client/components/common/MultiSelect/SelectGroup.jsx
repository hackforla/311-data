import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import SelectItem from './SelectItem';

const useStyles = makeStyles(theme => ({
  groupName: {
    ...theme.typography.body2,
    marginTop: theme.gaps.sm,
    marginBottom: theme.gaps.xs,
  },
}));

const SelectGroup = ({
  name,
  items,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.groupName}>
        {`${name} (${items.length})`}
      </div>
      {items.map(item => (
        <SelectItem
          key={item.councilId}
          text={item.councilName}
          value={item.councilId}
          onClick={onChange}
        />
      ))}
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
