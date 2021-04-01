import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET_INGREDIENTS':
      return action.ingredients;
    case 'ADD_INGREDIENT':
      return [...currentIngredients, action.ingredient];
    case 'REMOVE_INGREDIENT':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
        throw new Error('We\'ll never reach this case!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    
    fetch('https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      dispatch({
        type: 'ADD_INGREDIENT',
        ingredient: {
          id: responseData.name,
          ...ingredient
        }
      })
    }).catch(error => {
      setError(error.message);
      setIsLoading(false);
    });
  }

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);

    fetch(`https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      dispatch({
        type: 'REMOVE_INGREDIENT',
        id: ingredientId
      });
    }).catch(error => {
      setError(error.message);
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET_INGREDIENTS',
      ingredients: filteredIngredients
    })
  }, []);

  const onCloseErrorModalHandler = () => {
    setError(null);
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} loading={isLoading} ></IngredientList>
      </section>

      {error && <ErrorModal onClose={onCloseErrorModalHandler}>{ error }</ErrorModal>}
    </div>
  );
}

export default Ingredients;
