/* eslint-disable */

import React from 'react';

/*
 * useEffect wrapper to call the callback function only when component gets
 * mounted (componentDidMount equivalent)
 */
const useMount = callback => {
  React.useEffect(callback, []);
};

/* useEffect wrapper to call the callback function when component gets
 * unmounted (componentWillUnmount equivalent)
 */
const useUnmount = callback => {
  React.useEffect(() => callback, [callback]);
};

/* useEffect wrapper that is equivalent to useEffect except will use state
 * values after the dependency change
 */
const useUpdateEffect = function (effectCallback, deps = [])  {
  const isFirstMount = React.useRef(false)
  
  React.useEffect(() => {
    return () => {
      isFirstMount.current = false
    }
  }, [])
  React.useEffect(() => {
    // Do not execute effectcallback for the first time
    if (!isFirstMount.current) {
      isFirstMount.current = true
    } else {
      return effectCallback()
    }
  }, deps)
}

/* setState wrapper that allows setting of a single state variable
 * (think.setState in traditional class-based components)
 */
const useSetState = initState => {
  const [state, setState] = React.useState(initState);

  const setMergeState = value => {
    setState(prevValue => {
      const newValue = typeof value === 'function' ? value(prevValue) : value;
      return newValue ? { ...prevValue, ...newValue } : prevValue;
    });
  };

  return [state, setMergeState];
};

export {
  useMount,
  useUnmount,
  useUpdateEffect,
  useSetState,
};
