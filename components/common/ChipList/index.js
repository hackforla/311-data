import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
  root: {
    fontFamily: 'Roboto',
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  itemWrapper: {
    padding: 2,
  },
});

function ChipList({
  children,
}) {
  const classes = useStyles();

  return (
    <Box className={classes.root} component="ul">
      {
        React.Children.map(children, child => (
          <li className={classes.itemWrapper}>{child}</li>
        ))
      }
    </Box>
  );
}

export default ChipList;
export { default as StyledChip } from './StyledChip';

ChipList.propTypes = {
  children: PropTypes.node.isRequired,
};
