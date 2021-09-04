/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { acceptCookies } from '@reducers/ui';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles(theme => ({
  root: {
    width: 325,
    backgroundColor: "#29404F",
  },
  title: {
    paddingTop: 16,
    paddingLeft: 16,
    ...theme.typography.h4
  },
  headStyle: {
    padding: 10,
    backgroundColor: "#87C8BC",
  },
  iconStyle: {
    verticalAlign: "bottom"
  },
  copyStyle: {
    paddingTop: 5,
    fontSize: 12
  },
  buttonStyle: {
    padding: 0,
    color: "#FFB100"
  }
}));

const CookieNotice = ({
  showCookieNotice,
  acceptCookieNotice,
}) => {
  const classes = useStyles();
  const handleClick = () => {
    acceptCookieNotice();
    sessionStorage.setItem('accept-cookies', true);
  };

  if (showCookieNotice) {
    return (
      <Card className={classes.root}>
        <CardHeader className={classes.headStyle}></CardHeader>
        <div className={classes.title}>
          <InfoOutlinedIcon className={classes.iconStyle} fontSize="small"/> Cookies and Privacy Policy<br />
        </div>
      <CardContent className={classes.copyStyle}>
        We use cookies and other tracking technologies to improve your browsing experience and to better understand our website traffic. By browsing our website, you consent to our use of cookies and other tracking technologies.
        <Button href="#" className={classes.buttonStyle} size="small"> Learn More</Button>
        <CardActions style={{ justifyContent: "flex-end" }} >
        <Button href="#" variant="outlined">Got it!</Button>
        </CardActions>
      </CardContent>
  
    </Card>

      // <div className="cookie-notice">
      //   <div className="cookie-title has-text is-size-6 has-text-weight-bold">
      //     {/* <Icon
      //       id="tooltip-icon"
      //       icon="info-circle"
      //       size="small"
      //       style={{ marginRight: '6px' }}
      //     /> */}
      //     Cookies and Privacy Policy
      //   </div>
      //   <div className="text has-text is-size-7">
      //     We use cookies and other tracking technologies to improve your browsing experience and to
      //     better understand our website traffic. By browsing our website, you consent to our use of
      //     cookies and other tracking technologies.&nbsp;
      //     <Link to="/privacy">Learn more</Link>
      //   </div>
      //   {/* <Button
      //     id="cookie-notice"
      //     label="Got it!"
      //     size="small"
      //     handleClick={handleClick}
      //   /> */}
      // </div>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  showCookieNotice: !state.ui.cookiesAccepted,
});

const mapDispatchToProps = dispatch => ({
  acceptCookieNotice: () => dispatch(acceptCookies()),
});

CookieNotice.propTypes = {
  showCookieNotice: PropTypes.bool.isRequired,
  acceptCookieNotice: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CookieNotice);
