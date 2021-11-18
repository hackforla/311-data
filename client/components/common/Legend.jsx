// import React from 'react';
/* eslint-disable */
import React, {useState, useEffect} from 'react';

//video
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';


import CardMedia from '@material-ui/core/CardMedia';

import { Close } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';

//from filterMenu.js
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

//TODO: Commented out because Map is commented out, need help with displaying component to then render type
import { CircleIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { REQUEST_TYPES } from './CONSTANTS';
import { ListItem } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    zIndex: 50000,
    position: 'absolute',
    bottom: 0,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.focus,
    padding: theme.gaps.xs,
    paddingLeft: theme.gaps.sm,
    marginBottom: 2,
    borderRadius: theme.borderRadius.sm,
    fontSize: '14px',
    fontFamily: 'Roboto',

  },
  content: {
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.palette.primary.main,
    padding: theme.gaps.sm,
  },
  //may need to add headerAction when collapsible added
  button: {
    padding: '0 0 0 5px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& svg': {
      fontSize: 30,
      paddingRight: 0,
      '&  path': {
        fill: theme.palette.primary.focus,
      },
    },
  },
}));

// const NewSingleItem = ({item}) => {
//   <li>
//     <p>{item.displayName}</p>
//   </li>
// };


const Legend = () => {
  // TODO:error on 127
  const [collapse, setCollapse] = useState(true);
  const [title, setTitle] = useState("Expand");
  const toggle = () => {
    setIsCollapse(!isCollapse);
    setIcon(state => {
      return state === <ArrowDropDownIcon /> ? <ArrowDropUpIcon />
        :<ArrowDropDownIcon />;
    });
  };

  const collapseAll = () => {
    setCollapse(!collapse);
    setTitle(state => {
        return state === "Expand" ? "Collapse" : "Expand";
    }
    )};
    useEffect(() => {
      toggle(!collapse);
    }, [collapse]);


  const classes = useStyles();
  return (

     <Card
     classes={{
       root: classes.card
     }}>
     <div className="export-legend-wrapper">
       <CardHeader
       onClick={collapseAll}
       classes={{
        root: classes.header,
        action: classes.headerAction,
       }}
       action={
        <IconButton onClick={() => toggle()}
        className={classes.button}
        >
          <Close />
        </IconButton>
       }

       title = "LEGEND"
       />


       <CardContent
       className={classes.content} collapse={!collapse}
       >
          <div className="type-selectors" >
              { Object.keys(REQUEST_TYPES).map((id, index) => {
                const type = REQUEST_TYPES[id];
                // const selected = selectedTypes.includes(id);
                return (
                  // <div onClick={() => toggle(index)} key={index}>
                  <div
                    key={id}
                    className="type-selector"
                    >
                    <div
                      className="type-color"
                      style={{
                        // backgroundColor: selected ? schemeColors[id] : 'transparent',
                        // borderWidth: selected ? 0 : 1,
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                      }}
                    />
                    {/* <CircleIcon
                      // id={`request-icon-${id}`}
                    icon="circle"
                    size="small"
                    // style={ type.color }
                    /> */}
                    <div className="type-name">{ type.displayName } </div>
                  </div>

                );
              })}
            </div>


       {/* Render type  unless non selected*/}
       {/* {
            renderLegendTypes.length ? renderLegendTypes : 'No request types selected'
          } */}

      </CardContent>
      </div>
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
