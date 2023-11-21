import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import Button from '@mui/material/Button';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { acceptCookies } from '@reducers/ui';
import colors from '@theme/colors';

const useStyles = makeStyles(theme => ({
  root: {
    width: 325,
    backgroundColor: colors.primaryLight,
    zIndex: 50000,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  title: {
    ...theme.typography.body1,
    fontSize: '17px',
    fontWeight: 700,
    paddingTop: 16,
    paddingLeft: 16,
  },
  headStyle: {
    padding: 8,
    backgroundColor: colors.secondaryFocus,
  },
  iconStyle: {
    verticalAlign: 'text-top',
  },
  copyStyle: {
    paddingTop: 5,
    fontSize: 12,
    '&:last-child': {
      paddingBottom: 5,
    },
  },
  linkStyle: {
    padding: 0,
    color: colors.primaryFocus,
    marginLeft: 3,
    textDecoration: 'none',
  },
}));

function CookieNotice({
  showCookieNotice,
  acceptCookieNotice,
}) {
  const classes = useStyles();
  const handleClick = () => {
    acceptCookieNotice();
    sessionStorage.setItem('accept-cookies', true);
  };

  if (showCookieNotice) {
    return (
      <Card className={classes.root}>
        <CardHeader className={classes.headStyle} />
        <div className={classes.title}>
          <InfoOutlinedIcon className={classes.iconStyle} fontSize="small" />
          {' '}
          Cookies and Privacy Policy
          <br />
        </div>
        <CardContent className={classes.copyStyle}>
          We use cookies and other tracking technologies to improve your browsing
          experience and to better understand our website traffic. By browsing our
          website, you consent to our use of cookies and other tracking technologies.
          <Link className={classes.linkStyle} to="/privacy">Learn more</Link>
          <CardActions style={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClick}>Got it!</Button>
          </CardActions>
        </CardContent>

      </Card>
    );
  }
  return null;
}

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
