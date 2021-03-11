import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.primary.focus}`,
    paddingBottom: theme.gaps.xs,
  },
  input: {
    border: 'none',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.text.secondaryLight,
    '&::placeholder': {
      ...theme.typography.body2,
      color: theme.palette.text.secondaryDark,
    },
    paddingLeft: theme.gaps.xs,
    width: '100%',
  },
  icon: {
    display: 'inline-block',
    fontSize: 20,
    color: theme.palette.primary.focus,
  },
}));

const SearchBar = ({
  value,
  placeholder,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <SearchIcon className={classes.icon} />
      <input
        className={classes.input}
        type="text"
        name="council-search"
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        value={value}
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchBar;

SearchBar.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

SearchBar.defaultProps = {
  value: null,
  placeholder: 'Search',
  onChange: () => null,
};
