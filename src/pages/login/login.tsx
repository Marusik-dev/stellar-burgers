import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector } from 'react-redux';
import {
  getLoginUser,
  getUserState
} from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, isAuthenticated } = useSelector(getUserState);

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    dispatch(getLoginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to={'/'} />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
