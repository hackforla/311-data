import { makeStyles, createStyles } from '@material-ui/core/styles';

const sharedFontStyles = makeStyles(() => createStyles({
  oswald: {
    fontFamily: ['Oswald', 'sans-serif'],
  },
  roboto: {
    fontFamily: ['Roboto', 'sans-serif'],
  },
  medium: {
    fontWeight: 500,
  },
  regular: {
    fontWeight: 400,
  },
  bold: {
    fontWeight: 700,
  },
  jumbo: {
    fontSize: '46px',
  },
}));

export default sharedFontStyles;
