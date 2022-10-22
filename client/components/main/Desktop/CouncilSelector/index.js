import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateNcId } from '@reducers/filters';
import { makeStyles } from '@material-ui/core/styles';
import not from '@utils/not';
import SelectorBox from '@components/common/SelectorBox';
import SelectedCouncils from './SelectedCouncils';
import CouncilsList from './CouncilsList';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'inline-block',
    font: theme.typography.b2,
    marginBottom: '10px',
    color: theme.palette.secondary.light,
  },
}));

// TODO: display loader while fetching councils

const CouncilSelector = ({
  councils,
  updateCouncilsFilter,
  resetMap,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);
  const [unselected, setUnselected] = useState([]);

  useEffect(() => {
    setUnselected(councils);
  }, [councils]);

  const handleDelete = e => {
    const deletedCouncilId = Number(e.currentTarget.dataset.id);
    const newSelected = selected.filter(({ councilId }) => councilId !== deletedCouncilId);
    const newUnselected = not(councils, newSelected, 'councilId');
    setSelected(newSelected);
    setUnselected(newUnselected);
    updateCouncilsFilter(deletedCouncilId);
    resetMap();
  };

  const handleSelect = e => {
    const selectedCouncilId = Number(e.currentTarget.value);
    if (!selected.some(({ councilId }) => councilId === selectedCouncilId)) {
      const newSelectedCouncil = councils.find(({ councilId }) => councilId === selectedCouncilId);
      const newSelected = [...selected, newSelectedCouncil];
      const newUnselected = not(councils, newSelected, 'councilId');
      setSelected(newSelected);
      setUnselected(newUnselected);
      updateCouncilsFilter(selectedCouncilId);
    }
  };

  return (
    <>
      <div className={classes.label}>Boundaries</div>
      <SelectorBox>
        <SelectorBox.Display>
          <SelectedCouncils
            items={selected}
            onDelete={handleDelete}
          />
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          {
            unselected
              && (
                <CouncilsList
                  items={unselected}
                  onClick={handleSelect}
                />
              )
          }
        </SelectorBox.Collapse>
      </SelectorBox>
    </>
  );
};

const mapStateToProps = state => ({
  councils: state.metadata.councils,
});

const mapDispatchToProps = dispatch => ({
  updateCouncilsFilter: councilId => dispatch(updateNcId(councilId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CouncilSelector);

CouncilSelector.defaultProps = {
  resetMap: () => {},
};

CouncilSelector.propTypes = {
  councils: PropTypes.arrayOf(PropTypes.shape({})),
  updateCouncilsFilter: PropTypes.func.isRequired,
  resetMap: PropTypes.func,
};

CouncilSelector.defaultProps = {
  councils: [],
};
