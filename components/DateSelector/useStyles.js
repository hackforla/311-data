import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  label: {
    marginBottom: 5,
    display: 'inline-block',
    fontFamily: 'Roboto',
  },
  selector: {
    fontFamily: 'Roboto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > div': {
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
    },
    marginLeft: -10,
  },
  separator: {
    marginLeft: theme.gaps.md,
    borderRight: `1.5px solid ${theme.palette.text.secondaryLight}`,
    height: '1.2rem',
  },
  option: {
    cursor: 'pointer',
    padding: 6,
    margin: '2px 0',
    fontFamily: 'Roboto',
    width: '100%',
    backgroundColor: theme.palette.primary.dark,
    border: 'none',
    textAlign: 'left',
    color: theme.palette.text.secondaryLight,
    '&:hover': {
      backgroundColor: theme.palette.selected.primary,
    },
  },
  selected: {
    backgroundColor: `${theme.palette.selected.primary} !important`,
  },
}));

export default useStyles;
