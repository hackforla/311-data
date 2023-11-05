import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import fonts from '@theme/fonts';
import colors from '@theme/colors';
import accessibileIcon from '../assets/nav-accessibility-icon.png';

// Header should make use of style overrides to look the same regardless of light/dark theme.
const useStyles = makeStyles(theme => ({
  appBar: {
    height: theme.header.height,
    backgroundColor: theme.palette.primary.main,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  button: {
    color: 'white',
    textTransform: 'none',
    fontFamily: fonts.family.roboto,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    textDecoration: 'none',
  },
  textLogo: {
    ...theme.typography.h4,
    fontFamily: fonts.family.oswald,
    fontSize: '30px',
    letterSpacing: '0.13em',
    fontWeight: theme.typography.fontWeightBold,
    flexGrow: 1,
  },
  headStyle: {
    padding: 0,
    height: '15px',
    backgroundColor: colors.primaryFocus,
  },
  iconStyle: {
    verticalAlign: 'text-top',
  },
  iconMenuStyle: {
    '& ul': {
      width: '325px',
      padding: 0,
    },
  },
  accessibileMenu: {
    width: '487px',
    height: 'auto',
    backgroundColor: colors.textSecondaryLight,
    color: colors.secondaryDark,
    zIndex: 50000,
    position: 'inherit',
    bottom: 0,
    right: 0,
  },
  accessibileMenuUl: {
    '& ul:first-child': {
      width: '487px',
      padding: 0,
    },
    '& li': {
      padding: 0,
      '& p': {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    '& li:nth-child(2n+4)': {
      backgroundColor: 'white',
    },
  },
  accessibileContent: {
    width: '100%',
    padding: 0,
    '& p': {
      margin: 0,
    },
    '& ul': {
      listStyle: 'none',
      paddingLeft: 0,
      textWrap: 'wrap',
    },
  },
  accessibileIcon: {
    display: 'inline-block',
    paddingRight: '3px',
  },
  accessibileCardTitle: {
    fontWeight: 500,
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 5,
    paddingLeft: 16,
    display: 'inline-block',
  },
  accessibileCopyStyle: {
    fontSize: 12,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  menuPaper: {
    backgroundColor: colors.textPrimaryLight,
    '& a': {
      textDecoration: 'none',
    },
  },
  menuItem: {
    ...theme.typography.body2,
    color: 'white',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  imageStyle: {
    verticalAlign: 'middle',
  },
}));

const activeStyle = {
  borderBottom: `1px solid ${colors.primaryFocus}`,
};

// TODO: links/routing, mobile
const Header = () => {
  const classes = useStyles();
  const [isDashboardOpen, setIsDashboardOpen] = React.useState(false);
  const [isIconOpen, setIsIconOpen] = React.useState(false);

  const handleDashboardClick = event => {
    setIsDashboardOpen(event.currentTarget);
  };

  const handleDashboardClose = () => {
    setIsDashboardOpen(null);
  };

  const handleIconClick = event => {
    setIsIconOpen(event.currentTarget);
  };

  const handleIconClose = () => {
    setIsIconOpen(null);
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h4" className={classes.textLogo}>
          <Link to="/" className={classes.link}>311DATA</Link>
        </Typography>
        <NavLink className={classes.link} to="/map" activeStyle={activeStyle}>
          <Button className={classes.button}>Map</Button>
        </NavLink>
        <Button
          id="dashboard-anchor"
          onClick={handleDashboardClick}
          className={classes.button}
        >
          Dashboard
        </Button>
        <Menu
          id="dashboard-menu"
          anchorEl={isDashboardOpen}
          keepMounted
          open={Boolean(isDashboardOpen)}
          onClose={handleDashboardClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          classes={{ paper: classes.menuPaper }}
        >
          <Link to="/dashboard/overview-combined">
            <MenuItem onClick={handleDashboardClose} className={classes.menuItem}>
              Overview
            </MenuItem>
          </Link>
          <Link to="/dashboard/nc-summary-comparison">
            <MenuItem onClick={handleDashboardClose} className={classes.menuItem}>
              Compare Two Neighborhoods
            </MenuItem>
          </Link>
        </Menu>
        <NavLink to="/faqs" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>FAQ</Button>
        </NavLink>
        <NavLink to="/about" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>About</Button>
        </NavLink>
        <NavLink to="/research" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Research</Button>
        </NavLink>
        <NavLink to="/contact" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Contact</Button>
        </NavLink>
        <IconButton
          onClick={handleIconClick}
          className={classes.imageStyle}
          aria-controls={isIconOpen ? 'accessibile-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isIconOpen ? 'true' : undefined}
        >
          <img src={accessibileIcon} alt="Accessibility" width="24px" />
        </IconButton>
        <Menu
          className={classes.accessibileMenuUl}
          id="accessibile-menu"
          anchorEl={isIconOpen}
          getContentAnchorEl={null}
          keepMounted
          open={Boolean(isIconOpen)}
          onClose={handleIconClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={handleIconClose}>
            <Card className={classes.accessibileMenu}>
              <CardHeader className={classes.headStyle} />
              <CardContent className={`${classes.accessibileContent} ${classes.accessibileCopyStyle}`}>
                <p className={classes.accessibileCardTitle}>
                  Accessibility Information
                </p>
                <ul>
                  <li style={{ paddingBottom: 10 }}>
                    <span style={{ fontWeight: 700, paddingLeft: 16 }}>Map</span>
                    <br />
                    <p>
                      The map shows the Neighborhood
                      Councils (NC)in Los Angeles. Each
                      NC is outlined in a
                      dotted line, and the border of
                      each NC is outlined in a thick
                      yellow line when hovering over
                      it with your mouse.
                    </p>
                  </li>
                  <li style={{ paddingBottom: 12 }}>
                    <span style={{ fontWeight: 700, paddingLeft: 16 }}>
                      Data Visualization
                    </span>
                    <br />
                    <p>
                      Data visualizations show the
                      results once the filter criterias are
                      selected and submitted. Thecharts display
                      details once the mouse hovers over the charts.
                    </p>
                  </li>
                  <li style={{ paddingBottom: 12 }}>
                    <span style={{ fontWeight: 700, paddingLeft: 16 }}>
                      Keyboard Accessibility
                    </span>
                    <br />
                    <p>
                      Use these common keyboard commands
                      to navigate web pages without a mouse.
                      Some keystrokes may not work with every Internet
                      browser.
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Move backwards from link to link or to controls:
                      <span style={{ fontWeight: 700 }}>Shift + Tab</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Select buttons:
                      <span style={{ fontWeight: 700 }}>Spacebar</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Navigate and select Radio Buttons:
                      <span style={{ fontWeight: 700 }}>Arrow</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Select/deselect boxes:
                      <span style={{ fontWeight: 700 }}>Spacebar</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Move from box to box:
                      <span style={{ fontWeight: 700 }}>Tab</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Open a List Box:
                      <span style={{ fontWeight: 700 }}>ALT + Down arrow</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Read the prior screen:
                      <span style={{ fontWeight: 700 }}>CTRL + Page down</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Go to the top of page:
                      <span style={{ fontWeight: 700 }}>CTRL + Home</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Go to the bottom of the page:
                      <span style={{ fontWeight: 700 }}>CTRL + End</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Close the current window (in Internet Explorer):
                      <span style={{ fontWeight: 700 }}>CTRL + W</span>
                    </p>
                  </li>
                  <li style={{ paddingTop: 6, paddingBottom: 6 }}>
                    <p>
                      Refresh the screen:
                      <span style={{ fontWeight: 700 }}>F5</span>
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
