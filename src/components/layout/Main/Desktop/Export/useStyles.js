import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  exportButton: {
    width: 300,
    justifyContent: 'center',
    color: theme.palette.text.secondaryLight,
    borderColor: theme.palette.text.secondaryLight,
    borderRadius: 5,
    backgroundColor: 'transparent',
    text: 'black',
    padding: 3,
    '&:hover': {
      backgroundColor: theme.palette.text.secondaryLight,
      color: 'black'
    },
  },
  confirmationButton: {
    width: '229px',
    height: '30px',
    borderRadius: '5px',
    border: '1px solid #ECECEC',
    '&:hover': {
      backgroundColor: '#DADADA',
      borderColor: '#DADADA',
    },
    fontWeight: '500',
    fontSize: '18px',
    marginTop: '10px',
  },
  confirmationOk: {
    backgroundColor: theme.palette.secondary.light,
    color: '#29404F',
  },
  confirmationCancel: {
    backgroundColor: '#29404F',
    color: theme.palette.text.secondaryLight,
  },
  warningButton: {
    width: '169px',
    height: '25px',
    borderRadius: '5px',
    backgroundColor: theme.palette.secondary.light,
    border: '1px solid #ECECEC',
    '&:hover': {
      backgroundColor: '#DADADA',
      borderColor: '#DADADA',
    },
    color: '#29404F',
    fontWeight: '500',
    fontSize: '18px',
    marginTop: '10px',
    paddingTop: '8px',
  },
  imageIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  },
}));

export default useStyles;
