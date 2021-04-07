import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useFetch from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'REMOVE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
        throw new Error('We\'ll never reach this case!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier } = useFetch();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'REMOVE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: {
        id: data.name,
        ...reqExtra
      } });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      'https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((ingredientId) => {
    sendRequest(
      `https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, 
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  const onCloseErrorModalHandler = useCallback(() => {
    // dispatchHttp({ type: 'CLEAR_ERROR' });
  });

  const ingredientList = useMemo(() => {
    return (
    <IngredientList 
      ingredients={userIngredients} 
      onRemoveItem={removeIngredientHandler}></IngredientList>
  )}, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        
        { ingredientList }
      </section>

      {error && <ErrorModal onClose={onCloseErrorModalHandler}>{ error }</ErrorModal>}
    </div>
  );
}

export default Ingredients;
