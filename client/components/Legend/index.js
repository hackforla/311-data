import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { toggleLegend } from '@reducers/ui';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    right: 35,
    bottom: 75,
    borderRadius: theme.borderRadius.md,
  },
  header: {
    color: theme.palette.primary.focus,
    textAlign: 'center',
  }
}));

const Legend = ({
  toggleLegend,
}) => {
  const classes = useStyles();

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
    </Card>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleLegend: () => dispatch(toggleLegend()),
});

export default connect(null, mapDispatchToProps)(Legend);

Legend.propTypes = {
  toggleLegend: PropTypes.func.isRequired,
};