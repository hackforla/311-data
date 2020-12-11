import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { getPinInfoRequest } from '@reducers/data';
import { REQUEST_TYPES, COUNCILS } from '@components/common/CONSTANTS';

class RequestDetail extends React.Component {
  componentDidUpdate(prev) {
    const { srnumber, pinsInfo, getPinInfo } = this.props;
    if (srnumber === prev.srnumber)
      return;

    if (srnumber && !pinsInfo[srnumber])
      getPinInfo(srnumber);
  }

  render() {
    const { srnumber, pinsInfo } = this.props;

    if (!srnumber)
      return null;

    if (!pinsInfo[srnumber])
      return <div>loading</div>

    const {
      requesttype,
      address,
      createddate,
      updateddate,
      closeddate,
      status,
      nc,
    } = pinsInfo[srnumber];

    const ncName = COUNCILS.find(c => c.id == nc)?.name;
    const { displayName, color, abbrev } = REQUEST_TYPES[requesttype];

    return (
      <div className="pin-popup">
        <p className="pin-popup-type has-text-weight-bold">
          {displayName}
          {/*&nbsp;
          [
          <span className="pin-popup-type-abbrev" style={{ color }}>
            {abbrev}
          </span>
          ]*/}
        </p>
        <p className="pin-popup-ncname">{ncName}</p>
        <p className="pin-popup-address has-text-weight-bold">{address}</p>
        <div className="pin-popup-status">
          <p>
            Reported on&nbsp;
            {moment.unix(createddate).format('l')}
          </p>
          <p>{srnumber}</p>
          {/*<p>
            Status:&nbsp;
            {status}
          </p>
          {
            closeddate ? (
              <p>
                Closed on&nbsp;
                {moment.unix(closeddate).format('l')}
              </p>
            ) : (
              <>
                <p>
                  Last updated on&nbsp;
                  {moment.unix(updateddate).format('l')}
                </p>
              </>
            )
          }*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
});

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestDetail);

RequestDetail.propTypes = {
  srnumber: PropTypes.string,
  pinsInfo: PropTypes.shape({}),
  getPinInfo: PropTypes.func.isRequired,
};

RequestDetail.defaultProps = {
  srnumber: null,
  pinsInfo: {},
};
