import { TRegisterData } from '@api';
import { ProfileUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUser,
  updateUser,
  getAuthChecked
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из store
  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getAuthChecked);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isFormChanged && user) {
      // Создаем объект для обновления
      const updatedUser: TRegisterData = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password || ''
      };

      dispatch(updateUser(updatedUser));
      setFormValue((prev) => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return null;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
