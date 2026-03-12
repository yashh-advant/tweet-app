import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { uiActions } from '../../store/ui-slice';

function Toasts({ message }) {
  let timerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        dispatch(uiActions.clearToastMessage());
      }, 2000);
    };
    startTimer();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [message, dispatch]);

  const handleCloseToast = () => {
    dispatch(uiActions.clearToastMessage());
    clearTimeout(timerRef.current);
  };

  return (
    <div>
      <p>{message}</p>
      <button onClick={handleCloseToast}>X</button>
    </div>
  );
}

export default Toasts;
