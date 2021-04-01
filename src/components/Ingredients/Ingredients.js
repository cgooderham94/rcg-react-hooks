import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
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
      setUserIngredients((prevIngredients) => [
        ...prevIngredients, {
          id: responseData.name,
          ...ingredient
        }
      ]);
    });
  }

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);

    fetch(`https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setIsLoading(false);
      setUserIngredients((prevIngredients) => prevIngredients.filter((ingredient) => {
        return ingredientId !== ingredient.id;
      }));
    }).catch(error => {
      setError(error.message);
      setIsLoading(false);
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
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
