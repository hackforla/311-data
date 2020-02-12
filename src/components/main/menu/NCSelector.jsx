import React, { useState } from 'react';
import { connect } from 'react-redux';

import { toggleNeighborhoodCouncil } from '../../../redux/reducers/data';

import { COUNCILS } from '../../common/CONSTANTS';
import Checkbox from '../../common/Checkbox';

const NCSelector = ({
  councils,
  toggleCouncil,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredCouncilList, setFilteredCouncilList] = useState(COUNCILS);

  const handleSearch = (e) => {
    const term = e.target.value;
    const searchFilter = new RegExp(term, 'i');
    const searchList = COUNCILS.filter((council) => searchFilter.test(council));
    setFilteredCouncilList(searchList);
    setSearchValue(e.target.value);
  };

  return (
    <div className="nc-selector" style={{ width: '349px' }}>
      <div className="nc-title">
        <p className="is-size-6" style={{ padding: '15px 0' }}>
          <strong>
            Neighborhood Council (NC) Selection
          </strong>
        </p>
      </div>

      <div className="nc-seach-list-wrapper">
        <div className="nc-search">
          <div className="field">
            <div className="control has-icons-right">
              <input
                className="input"
                type="text"
                placeholder="Search"
                style={{
                  border: '1px solid #999999',
                  borderRadius: '3px',
                  boxSizing: 'border-box',

                }}
                value={searchValue}
                onChange={handleSearch}
              />
              <span className="icon is-small is-right">
                <i className="fas fa-check" />
              </span>
            </div>
          </div>
        </div>

        <div
          className="nc-list"
          style={{
            height: '231px',
            overflow: 'scroll',
            padding: '10px 23px 10px 10px',
            border: '1px solid #999999',
            borderRadius: '3px',
            boxSizing: 'border-box',
          }}
        >
          <div className="level" style={{ margin: '0 0 7px 0' }}>
            <div className="level-left">
              <div className="level-item">
                <p className="is-size-7" style={{ width: '300px' }}>
                  SELECT ALL
                </p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Checkbox
                  id="nc-select-all"
                  handleClick={() => toggleCouncil('all')}
                  checked={councils?.all ?? false}
                />
              </div>
            </div>
          </div>

          {filteredCouncilList.map((council) => (
            <div key={council} className="level" style={{ margin: '0 0 7px 0' }}>
              <div className="level-left">
                <div className="level-item">
                  <p className="is-size-7" style={{ width: '300px', overflowY: 'hidden' }}>
                    {council}
                  </p>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Checkbox
                    id={`nc-select-${council}`}
                    handleClick={() => toggleCouncil(council)}
                    checked={councils?.[council] ?? false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  councils: state.data.councils,
});

const mapDispatchToProps = (dispatch) => ({
  toggleCouncil: (council) => dispatch(toggleNeighborhoodCouncil(council)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NCSelector);
