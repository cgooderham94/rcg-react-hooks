import React, { useReducer, useCallback } from 'react';

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

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...httpState, loading: true };
    case 'RESPONSE':
      return { ...httpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR_ERROR':
      return { ...httpState, error: null }
    default:
      throw new Error('Should not be reached!');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({ type: 'SEND' });
    
    fetch('https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });

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
      dispatchHttp({ type: 'ERROR', errorData: error.message });
    });
  }

  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({ type: 'SEND' });

    fetch(`https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });

      dispatch({
        type: 'REMOVE_INGREDIENT',
        id: ingredientId
      });
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({
      type: 'SET_INGREDIENTS',
      ingredients: filteredIngredients
    })
  }, []);

  const onCloseErrorModalHandler = () => {
    dispatchHttp({ type: 'CLEAR_ERROR' });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} loading={httpState.loading}></IngredientList>
      </section>

      {httpState.error && <ErrorModal onClose={onCloseErrorModalHandler}>{ httpState.error }</ErrorModal>}
    </div>
  );
}

export default Ingredients;
