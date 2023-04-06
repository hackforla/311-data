const settings = {
  map: {
    debounce: {
      duration: 1500, // milliseconds
      options: {
        leading: true, // calls function immediately when invoked (React-friendly)
        trailing: false, // calls function after last input event fired (Not React-friendly)
      },
    },
    eventName: { // to keep event handler names consistent throughout our codebase
      reset: 'reset',
    },
  },
};

export default settings;
