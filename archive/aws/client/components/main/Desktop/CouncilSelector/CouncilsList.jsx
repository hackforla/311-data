import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from '@components/common/SearchBar';
import GroupedMultiSelect from '@components/common/MultiSelect/GroupedMultiSelect';

const useStyles = makeStyles(theme => ({
  searchWrapper: {
    position: 'relative',
    height: '50px',
  },
  search: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    paddingLeft: theme.gaps.xs,
    paddingRight: theme.gaps.xs,
    paddingBottom: theme.gaps.sm,
  },
  scrollWrapper: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginRight: '-10px',
    marginBottom: '-10px',
    scrollbarColor: '#616161 #818181',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#818181',
      borderRadius: '0 0 5px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#616161',
      borderRadius: 20,
      height: 50,
    },
  },
  header: {
    color: theme.palette.text.cyan,
    marginTop: theme.gaps.xs,
  },
}));

const CouncilsList = ({
  items,
  onClick,
}) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <div className={classes.searchWrapper}>
        <div className={classes.search}>
          <SearchBar
            placeholder="Enter district"
            onChange={setSearchTerm}
            value={searchTerm}
          />
        </div>
      </div>
      <div className={classes.scrollWrapper}>
        <GroupedMultiSelect
          items={items}
          groupBy="regionName"
          onChange={onClick}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
};

export default CouncilsList;

CouncilsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  onClick: PropTypes.func.isRequired,
};

CouncilsList.defaultProps = {
  items: [],
};
