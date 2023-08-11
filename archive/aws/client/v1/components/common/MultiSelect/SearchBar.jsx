import React from 'react';
import PropTypes from 'proptypes';

const SearchBar = ({
  value,
  placeholder,
  onChange,
}) => (
  <div className="search-bar control has-icons-right">
    <input
      className="input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={placeholder}
    />
    <span className="icon is-small is-right">
      <i className="fas fa-search" />
    </span>
  </div>
);

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
