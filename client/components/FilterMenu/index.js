import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import GearButton from '../GearButton';

const useStyles = makeStyles(theme => ({
  card: {
    width: 300,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    left: 35,
    top: 75,
    borderRadius: 10,
  },
  header: {
    color: theme.palette.text.cyan,
    padding: 5,
    paddingRight: 0,
  },
  headerAction: {
    margin: 'auto',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: '2px',
  },
  button: {
    padding: 5,
    paddingRight: 0,
    color: theme.palette.text.dark,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    '& svg': {
      fontSize: 30,
    },
  },
}));

const FilterMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const classes = useStyles();

  // TODO: add basic/advanced toggle switch
  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{
          root: classes.header,
          action: classes.headerAction,
        }}
        title={(
          <>
            <GearButton
              aria-label="toggle map menu"
              // TODO: toggle left slider menu
              // eslint-disable-next-line
              onClick={() => console.log('toggle left slider')}
            />
            <Typography
              className={classes.headerTitle}
              component="span"
            >
              FILTERS
            </Typography>
          </>
        )}
        action={(
          <IconButton
            className={classes.button}
            aria-label="toggle filter menu"
            onClick={() => setExpanded(prevExpanded => !prevExpanded)}
            disableFocusRipple
            disableRipple
          >
            {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }
          </IconButton>
        )}
      />
      <Collapse in={expanded}>
        <CardContent>
          TODO: Selectors
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default FilterMenu;
