import React from 'react';
import PropTypes from 'proptypes';

const SearchBar = ({
  value,
  onChange,
}) => (
  <div className="search-bar control has-icons-right">
    <input
      className="input"
      type="text"
      placeholder="Search"
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label="Search"
    />
    <span className="icon is-small is-right">
      <i className="fas fa-search" />
    </span>
  </div>
);

export default SearchBar;

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

SearchBar.defaultProps = {
  value: null,
  onChange: () => null,
};
