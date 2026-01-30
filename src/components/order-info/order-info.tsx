import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getIngredientState } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';
import {
  getOrderByNumber,
  getOrderState
} from '../../services/slices/orderSlice';
import { useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const { getOrderByNumberResponse, request } = useSelector(getOrderState);
  const dispatch = useDispatch();
  const { number: orderNumber } = useParams<{ number: string }>();

  const { ingredients } = useSelector(getIngredientState);

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByNumber(Number(orderNumber)));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!getOrderByNumberResponse || !ingredients.length) {
      console.log('No order data or ingredients available');
      return null;
    }

    const date = new Date(getOrderByNumberResponse.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = getOrderByNumberResponse.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          } else {
            console.warn(`Ingredient with id ${item} not found`);
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    const result = {
      ...getOrderByNumberResponse,
      ingredientsInfo,
      date,
      total,
      number: getOrderByNumberResponse.number,
      status: getOrderByNumberResponse.status,
      name: getOrderByNumberResponse.name
    };

    return result;
  }, [getOrderByNumberResponse, ingredients]);

  if (request) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Заказ не найден</h3>
        <p>Не удалось загрузить информацию о заказе</p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
