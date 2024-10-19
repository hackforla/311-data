import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LinkIcon from '@mui/icons-material/Link';
import { connect } from 'react-redux';
import Radio from '@mui/material/Radio';
import {
  toggleMenu as reduxToggleMenu,
  closeMenu as reduxCloseMenu,
} from '@reducers/ui';

const drawerWidth = 275;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 2100,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#2A404E',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  share: {
    marginBottom: '100px',
    paddingLeft: '25px',
  },
  listItem: {
    paddingTop: '15px',
    paddingBottom: '15px',
    height: '24px',
  },
  listItemTitle: {
    paddingLeft: '28px',
  },
}));

function PersistentDrawerLeft({ menuIsOpen, toggleMenu, closeMenu }) {
  // TODO ADD FUNCTIONALITY
  const [selectedMapStyleValue, setMapStyleValue] = React.useState('Point Map');
  const [selectedMapModeValue, setMapModeValue] = React.useState('Dark');
  const [selectedDataColorScheme, setDataColorScheme] = React.useState(
    'Original',
  );
  const [selectedBoundariesValue, setBoundariesValue] = React.useState('None');

  const handleChangeMapStyle = event => {
    setMapStyleValue(event.target.value);
  };

  const handleChangeMapMode = event => {
    setMapModeValue(event.target.value);
  };

  const handleChangeDataColorScheme = event => {
    setDataColorScheme(event.target.value);
  };

  const handleChangeBoundaries = event => {
    setBoundariesValue(event.target.value);
  };

  const classes = useStyles();
  const theme = useTheme();

  const onClickShare = () => {
    // TODO ADD FUNCTIONALITY
  };

  useEffect(() => {
    const escFunction = e => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keyup', escFunction, false);

    return () => document.removeEventListener('keyup', escFunction, false);
  }, [closeMenu]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={toggleMenu} size="large">
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem key="Map Style" className={classes.listItemTitle}>
            <ListItemText primary="Map Style" />
          </ListItem>
          {['Point Map', 'Heat Map'].map(text => (
            <ListItem
              className={classes.listItem}
              style={{ color: selectedMapStyleValue === text && '#87C8BC' }}
              button
              key={text}
            >
              <ListItemIcon>
                <Radio
                  checked={selectedMapStyleValue === text}
                  onChange={handleChangeMapStyle}
                  value={text}
                  style={{ color: selectedMapStyleValue === text && '#87C8BC' }}
                  name="radio-button"
                  inputProps={{ 'aria-label': text }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        {/**
         * TODO ADD DYNAMIC LIST OF ITEMS
         * ADD COLOR TO RADIO BUTTONS
         */}
        <List>
          <ListItem key="Map Mode" className={classes.listItemTitle}>
            <ListItemText primary="Map Mode" />
          </ListItem>
          {['Dark', 'Light', 'Street'].map(text => (
            <ListItem
              style={{ color: selectedMapModeValue === text && '#87C8BC' }}
              button
              key={text}
              className={classes.listItem}
            >
              <ListItemIcon>
                <Radio
                  checked={selectedMapModeValue === text}
                  onChange={handleChangeMapMode}
                  value={text}
                  style={{ color: selectedMapModeValue === text && '#87C8BC' }}
                  name="radio-button"
                  inputProps={{ 'aria-label': text }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="Data Color Scheme" className={classes.listItemTitle}>
            <ListItemText primary="Data Color Scheme" />
          </ListItem>
          {['Original', 'Prism', 'Bold'].map(text => (
            <ListItem
              style={{ color: selectedDataColorScheme === text && '#87C8BC' }}
              button
              key={text}
              className={classes.listItem}
            >
              <ListItemIcon>
                <Radio
                  checked={selectedDataColorScheme === text}
                  onChange={handleChangeDataColorScheme}
                  value={text}
                  style={{
                    color: selectedDataColorScheme === text && '#87C8BC',
                  }}
                  name="radio-button"
                  inputProps={{ 'aria-label': text }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="Boundaries" className={classes.listItemTitle}>
            <ListItemText primary="Boundaries" />
          </ListItem>
          {['None', 'Neighborhood Councils', 'City Councils'].map(text => (
            <ListItem
              style={{ color: selectedDataColorScheme === text && '#87C8BC' }}
              button
              key={text}
              className={classes.listItem}
              selected={selectedBoundariesValue === text}
            >
              <ListItemIcon>
                <Radio
                  checked={selectedBoundariesValue === text}
                  onChange={handleChangeBoundaries}
                  value={text}
                  style={{
                    color: selectedBoundariesValue === text && '#87C8BC',
                  }}
                  name="radio-button"
                  inputProps={{ 'aria-label': text }}
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem key="Share" className={classes.share}>
            <ListItemIcon onClick={onClickShare}>
              <LinkIcon />
            </ListItemIcon>
            <ListItemText primary="Share" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

PersistentDrawerLeft.propTypes = {
  menuIsOpen: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  menuIsOpen: state.ui.menu.isOpen,
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
  closeMenu: () => dispatch(reduxCloseMenu()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PersistentDrawerLeft);
