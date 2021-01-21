import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  selector: {
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
    marginLeft: 10,
    borderRight: `1.5px solid ${theme.palette.text.primary}`,
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
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default useStyles;
