import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { getUserState } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const data = useSelector(getUserState).user;

  return <AppHeaderUI userName={data?.name} />;
};
