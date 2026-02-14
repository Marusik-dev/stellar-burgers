import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getOrders, getUserState } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds } from '../../services/slices/feedSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { userOrders, request } = useSelector(getUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
    dispatch(getFeeds());
  }, []);

  if (request === true) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
