import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

type ProtectedProps = {
  unAuth?: boolean;
  element: JSX.Element;
};

const ProtectedRoute = ({
  unAuth = false,
  element
}: ProtectedProps): JSX.Element => {
  const user = useSelector((state) => state.userAuth.currentUser);
  const isAuthenticationChecked = useSelector(
    (state) => state.userAuth.isAuthenticationChecked
  );

  const location = useLocation();

  if (!isAuthenticationChecked) {
    return <div>Загрузка...</div>;
  }

  if (unAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  if (!unAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  return element;
};

export const Auth = ProtectedRoute;
export const UnAuth = ({ element }: { element: JSX.Element }) => (
  <ProtectedRoute unAuth element={element} />
);
