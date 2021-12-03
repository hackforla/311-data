import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { REQUEST_TYPES } from './CONSTANTS';

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 20,
    boxShadow: 'none',
    zIndex: 50000,
    position: 'absolute',
    bottom: 50,
    right: 10,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.focus,
    padding: theme.gaps.xs,
    paddingLeft: 5,
    marginBottom: 2,
    borderRadius: 20,
    fontSize: '11px',
    fontFamily: 'Roboto',

  },
  content: {
    borderRadius: 20,
    backgroundColor: theme.palette.primary.main,
    padding: theme.gaps.sm,
    fontSize: '14px',
  },
  button: {
    padding: '0',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& svg': {
      fontSize: 30,
      paddingRight: 5,
      '&  path': {
        fill: theme.palette.primary.focus,
      },
    },
  },
}));
const Legend = () => {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(true);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  if (!collapsed) {
    return (
      <Card
        classes={{
          root: classes.card,
        }}
      >

        <CardHeader
          classes={{
            root: classes.header,
            action: classes.headerAction,
          }}
          action={(
            <IconButton
              onClick={() => toggle()}
              className={classes.button}
            >
              <Close style={{ paddingTop: 10, paddingRight: 10 }} />
            </IconButton>
          )}
          title="LEGEND"
          style={{ marginLeft: 60 }}
        />
        <CardContent className={classes.content}>
          <div className="type-selectors">
            { Object.keys(REQUEST_TYPES).map(id => {
              const type = REQUEST_TYPES[id];

              return (
                <div
                  key={id}
                  className="type-selector"
                >
                  <div
                    className="type-color"
                    style={{
                      backgroundColor: 'transparent',
                      borderWidth: 1,
                    }}
                  />
                  <div className="type-name">
                    <FiberManualRecordIcon
                      icon="circle"
                      size="9px"
                      style={{ color: type.color }}
                    />
                    { type.displayName }
                  </div>
                </div>

              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card
      style={{ padding: 0 }}
      classes={{
        root: classes.card,
      }}
    >

      <CardHeader
        style={{ paddingRight: 7 }}
        classes={{
          root: classes.header,
          action: classes.headerAction,
        }}
        action={(
          <IconButton
            onClick={() => toggle()}
            className={classes.button}
            style={{ padding: 0 }}
          >
            <FormatListBulletedIcon style={{ height: 60, width: 60 }} />
          </IconButton>
        )}
      />

    </Card>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.metadata.requestTypes,
  selectedTypes: state.filters.requestTypes,
});

export default connect(
  mapStateToProps,
)(Legend);
