import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from '@material-ui/core';

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
    textTransform: 'none',
    fontFamily: 'Roboto',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: 'white',
    textDecoration: 'none',
  },
  title: {
    ...theme.typography.h1,
    flexGrow: 1,
    fontSize: '30px',
    fontWeight: 'bold',
    letterSpacing: '4px',
  },
}));

const activeStyle = {
  borderBottom: '1px solid yellow',
};

// TODO: links/routing, mobile
const Header = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h1" className={classes.title}>
          <Link to="/" className={classes.link}>311DATA</Link>
        </Typography>
        <NavLink className={classes.link} to="/map" activeStyle={activeStyle}>
          <Button className={classes.button}>Map</Button>
        </NavLink>
        <Button
          id="report-anchor"
          onClick={handleClick}
          className={classes.button}
        >
          Reports
        </Button>
        <Menu
          id="report-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Link to="/reports/dashboards/overview" className={classes.link}>
            <MenuItem onClick={handleClose} button className={classes.button}>
              Overview
            </MenuItem>
          </Link>
          <Link to="/reports/dashboards/recent" className={classes.link}>
            <MenuItem onClick={handleClose} button className={classes.button}>
              Recent
            </MenuItem>
          </Link>
          <Link to="/reports/dashboards/neighborhood" className={classes.link}>
            <MenuItem onClick={handleClose} button className={classes.button}>
              Neighborhood
            </MenuItem>
          </Link>
          <Link to="/reports/dashboards/neighborhood_recent" className={classes.link}>
            <MenuItem onClick={handleClose} button className={classes.button}>
              Neighborhood Recent
            </MenuItem>
          </Link>
          <Link to="/reports/dashboards/types_map" className={classes.link}>
            <MenuItem onClick={handleClose} button className={classes.button}>
              Request Type Map
            </MenuItem>
          </Link>
        </Menu>
        <NavLink to="/faqs" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>FAQ</Button>
        </NavLink>
        <NavLink to="/about" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>About</Button>
        </NavLink>
        <NavLink to="/blog" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Blog</Button>
        </NavLink>
        <NavLink to="/privacy" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Privacy</Button>
        </NavLink>
        <NavLink to="/contact" className={classes.link} activeStyle={activeStyle}>
          <Button className={classes.button}>Contact</Button>
        </NavLink>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
