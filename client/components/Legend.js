import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LensIcon from '@material-ui/icons/Lens';
import ListItemText from '@material-ui/core/ListItemText';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const useStyles = makeStyles(theme => ({
  root: {
    width: 200,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    right: 35,
    bottom: 75,
    borderRadius: theme.borderRadius.md,
  },
  header: {
    color: theme.palette.primary.focus,
    textAlign: 'center',
  },
  content: {
    padding: 0,
  },
  listItem: {
    padding: 0,
  },
  listText: {
    margin: 0,
  },
  colorIcon: {
    fontSize: 'small',
    minWidth: theme.spacing(4),
  },
}));

const Legend = () => {
  const classes = useStyles();

  const renderLegendItems = () => {
    const items = Object.keys(REQUEST_TYPES).map(type => REQUEST_TYPES[type]);
    return items.map(item => {
      return (
        <ListItem className={classes.listItem}>
          <ListItemIcon>
            <LensIcon className={classes.colorIcon} style={{ color: item.color }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                component="span"
                variant="subtitle1"
                className={classes.inline}
              >
                {item.displayName}
              </Typography>
            }
            className={classes.listText}
          />
        </ListItem>
      );
    });
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        title={(
          <>
            <Typography variant="h2">
              LEGEND
            </Typography>
          </>
        )}
        className={classes.header}
      />
      <Divider />
      <CardContent className={classes.content}>
        <List>
          {renderLegendItems()}
        </List>
      </CardContent>
    </Card>
  );
};

export default Legend;