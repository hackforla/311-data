import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestStatus } from '@reducers/filters';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';


const useStyles = makeStyles(() => ({
  header: {
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
  },
}));

const ShareableLinkCreator = ({
  requestStatus,
}) => {
  const classes = useStyles();
  const [selection, setSelection] = useState('open');

  const handleSelection = (event, newSelection) => {
    setSelection(newSelection);
  };

  return (
    <>
        <Button 
        variant="contained"
        onClick={() => {
            console.log("link here")
            // const url = new URL(`${process.env.API_URL}/map`);
            const url = new URL(`${window.location.href.split('?')[0]}`);
            url.searchParams.append("councilId", requestStatus.councilId);
            for (let request_type_index = 1; request_type_index < 13; request_type_index++) {
                url.searchParams.append(`rtId${request_type_index}`, requestStatus.requestTypes[request_type_index]);
            }
            url.searchParams.append("requestStatusOpen", requestStatus.requestStatus.open);
            url.searchParams.append("requestStatusClosed", requestStatus.requestStatus.closed);
            url.searchParams.append("startDate", requestStatus.startDate);
            url.searchParams.append("endDate", requestStatus.endDate);
            console.log(url)
            console.log(requestStatus)
            navigator.clipboard.writeText(url)
        }}
        >Get Shareable Link</Button>
    </>
  );
};

const mapStateToProps = state => ({
  requestStatus: state.filters,
});

const mapDispatchToProps = dispatch => ({
  updateStatusFilter: status => dispatch(updateRequestStatus(status)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShareableLinkCreator);

ShareableLinkCreator.propTypes = {
//   requestStatus: PropTypes.shape({
//     open: PropTypes.bool.isRequired,
//     closed: PropTypes.bool.isRequired,
//   }).isRequired,
};
