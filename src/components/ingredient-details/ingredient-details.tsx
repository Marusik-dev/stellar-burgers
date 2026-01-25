// components/ingredient-details/ingredient-details.tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getCurrentIngredient } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const currentIngredient = useSelector(getCurrentIngredient);

  const ingredients = useSelector((state) => state.ingredients.items);

  const ingredientData = id
    ? ingredients.find((ingredient) => ingredient._id === id)
    : currentIngredient;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
