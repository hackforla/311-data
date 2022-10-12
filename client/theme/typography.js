import fonts from '@theme/fonts';

// Note to future maintainers...

// Ideally, define only font-size in the typography object below.

// Modifiers like font-weight and font-family, are component specific.
// Therefore, consider defining them in the className property of the
// <Typography> component via makeStyles().

// Example: <Typography variant="h1" className={classes.robotoBold}>

const typography = {
  button: {
    textTransform: 'none',
  },

  // Default family and weight for everything below.
  fontFamily: fonts.family.roboto,
  fontWeight: fonts.weight.regular,

  h1: {
    fontSize: 96,
  },
  h2: {
    fontSize: 60,
  },
  h3: {
    fontSize: 46,
  },
  h4: {
    fontSize: 36,
  },
  h5: {
    fontSize: 24,
  },
  h6: {
    fontSize: 18,
  },
  body1: {
    fontSize: 16,
  },
  body2: {
    fontSize: 14,
  },
  subtitle1: {
    fontSize: 16,
  },
  subtitle2: {
    fontSize: 21,
  },
};

export default typography;
