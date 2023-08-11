import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ChipList, { StyledChip } from '@components/common/ChipList';

const useStyles = makeStyles(theme => ({
  placeholder: {
    ...theme.typography.body2,
    color: theme.palette.text.secondaryDark,
  },
}));

const SelectedTypes = ({
  items,
  onDelete,
}) => {
  const classes = useStyles();

  const renderSelected = () => (
    items.map(item => (
      <StyledChip
        key={item.typeName}
        label={item.typeName}
        value={item.typeId}
        color={item.color}
        onDelete={onDelete}
      />
    ))
  );

  return (
    <ChipList>
      { items.length
        ? renderSelected()
        : <span className={classes.placeholder}>Select request types</span>}
    </ChipList>
  );
};

export default SelectedTypes;

SelectedTypes.propTypes = {
  onDelete: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
};
