import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ChipList, { StyledChip } from '@components/common/ChipList';

const useStyles = makeStyles(theme => ({
  placeholder: {
    ...theme.typography.body2,
    fontSize: '12px',
    color: theme.palette.text.secondaryDark,
  },
}));

const SelectedCouncils = ({
  items,
  onDelete,
}) => {
  const classes = useStyles();

  const renderSelected = () => (
    items.map(item => (
      <StyledChip
        key={item.councilName}
        label={item.councilName}
        value={item.councilId}
        onDelete={onDelete}
        outlined
      />
    ))
  );

  return (
    <ChipList>
      { items.length
        ? renderSelected()
        : <span className={classes.placeholder}>Neighborhood Districts</span>}
    </ChipList>
  );
};

export default SelectedCouncils;

SelectedCouncils.propTypes = {
  onDelete: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    councilId: PropTypes.number,
    councilName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
};
