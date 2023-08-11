import {
  useEffect, useRef, useCallback, useState,
} from 'react';

const useToggle = initialState => {
  const [isToggled, setIsToggled] = useState(initialState);
  const isToggledRef = useRef(isToggled);
  const toggle = useCallback(() => setIsToggled(!isToggledRef.current),
    [isToggledRef, setIsToggled]);

  useEffect(() => {
    isToggledRef.current = isToggled;
  }, [isToggled]);
  return [isToggled, toggle];
};

export default useToggle;
