import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    fetch('https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
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
    fetch(`https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      setUserIngredients((prevIngredients) => prevIngredients.filter((ingredient) => {
        return ingredientId !== ingredient.id;
      }));
    });
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}></IngredientList>
      </section>
    </div>
  );
}

export default Ingredients;
