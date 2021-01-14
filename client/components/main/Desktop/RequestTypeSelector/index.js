import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
// import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
// import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const RequestTypeSelector = ({
  requestTypes,
  selectedRequestTypes,
  
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState([]);

  const handleChange = e => setSelected(e.target.value);

  return (
    <FormControl className={classes.formControl}>
      {/* <InputLabel id="multiple-chip-label">Chip</InputLabel> */}
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selected}
        onChange={handleChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
};

const mapStateToProps = state => ({
  requestTypes: state.metadata.requestTypes,
  selectedRequestTypes: state.filters.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  selectType: type => dispatch(updateRequestType(type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestTypeSelector);

RequestTypeSelector.propTypes = {

};

RequestTypeSelector.defaultProps = {

};