import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { getUserState } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean; // ← меняем название для ясности
  // или оставляем onlyAuthorized но меняем логику
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false // ← по умолчанию false (требует авторизации)
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, isAuthenticated } = useSelector(getUserState);

  // Пока проверяем авторизацию - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если роут только для НЕавторизованных, а пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    // Редиректим откуда пришел или на главную
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Если роут для авторизованных, а пользователь НЕавторизован
  if (!onlyUnAuth && !isAuthenticated) {
    // Редиректим на логин
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Все проверки пройдены
  return children ? children : <Outlet />;
};
