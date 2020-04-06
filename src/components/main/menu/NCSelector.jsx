import React, { useState } from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import { updateNC } from '../../../redux/reducers/filters';

import { COUNCILS } from '../../common/CONSTANTS';
import Checkbox from '../../common/Checkbox';
import Icon from '../../common/Icon';
import HoverOverInfo from '../../common/HoverOverInfo';

const NCSelector = ({
  updateNCList,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredCouncilList, setFilteredCouncilList] = useState(COUNCILS.map(c => c.name));
  const [selectedCouncilList, setSelectedCouncilList] = useState(
    COUNCILS
      .map(c => c.name)
      .reduce((acc, council) => {
        acc[council] = false;
        return acc;
      }, { all: false }),
  );

  const selectRowStyle = {
    margin: '0 0 7px 0',
  };

  const selectRowTextStyle = {
    width: '280px',
  };

  const checkboxStyleFix = {
    padding: '10px',
    margin: '0',
  };

  const handleSearch = e => {
    const term = e.target.value;
    const searchFilter = new RegExp(term, 'i');
    const searchList = COUNCILS.map(c => c.name).filter(council => searchFilter.test(council));
    setFilteredCouncilList(searchList);
    setSearchValue(e.target.value);
  };

  const handleSelectCouncil = council => {
    const newSelectedCouncilList = { ...selectedCouncilList };

    switch (council) {
      case 'all': {
        let value = true;

        if (newSelectedCouncilList.all) {
          newSelectedCouncilList.all = false;
          value = false;
        }

        Object.keys(newSelectedCouncilList).forEach(c => {
          newSelectedCouncilList[c] = value;
        });
        break;
      }
      default:
        newSelectedCouncilList.all = false;
        newSelectedCouncilList[council] = !newSelectedCouncilList[council];
        break;
    }

    const newNCList = Object.keys(newSelectedCouncilList).filter(c => newSelectedCouncilList[c] && c !== 'all');

    setSelectedCouncilList(newSelectedCouncilList);
    updateNCList(newNCList);
  };

  return (
    <div className="nc-selector" style={{ width: '349px' }}>
      <div className="nc-title">
        <div className="is-size-6" style={{ padding: '15px 0' }}>
          <strong style={{ paddingRight: '10px' }}>
            Neighborhood Council (NC) Selection
          </strong>
          <HoverOverInfo
            title="Neighborhood Council (NC) Selection"
            text="This filter allows the user to select specific neighborhood councils."
          >
            <Icon
              id="type-selector-info-icon"
              icon="info-circle"
              size="small"
            />
          </HoverOverInfo>
        </div>
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
                <i className="fas fa-search" />
              </span>
            </div>
          </div>
        </div>

        <div
          className="nc-list"
          style={{
            height: '200px',
            overflowX: 'hidden',
            msOverflowY: 'scroll',
            padding: '10px 23px 10px 10px',
            border: '1px solid #999999',
            borderRadius: '3px',
            boxSizing: 'border-box',
          }}
        >
          <div className="level" style={selectRowStyle}>
            <div className="level-left">
              <div className="level-item">
                <p className="is-size-7" style={selectRowTextStyle}>
                  SELECT ALL
                </p>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <Checkbox
                  id="nc-select-all"
                  size="small"
                  handleClick={() => handleSelectCouncil('all')}
                  checked={selectedCouncilList?.all ?? false}
                  style={checkboxStyleFix}
                />
              </div>
            </div>
          </div>

          {filteredCouncilList.map(council => (
            <div key={council} className="level" style={selectRowStyle}>
              <div className="level-left">
                <div className="level-item">
                  <p className="is-size-7" style={selectRowTextStyle}>
                    {council}
                  </p>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <Checkbox
                    id={`nc-select-${council}`}
                    size="small"
                    handleClick={() => handleSelectCouncil(council)}
                    checked={selectedCouncilList?.[council] ?? false}
                    style={checkboxStyleFix}
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

const mapDispatchToProps = dispatch => ({
  updateNCList: council => dispatch(updateNC(council)),
});

NCSelector.propTypes = {
  updateNCList: propTypes.func,
};

NCSelector.defaultProps = {
  updateNCList: () => null,
};

export default connect(null, mapDispatchToProps)(NCSelector);
