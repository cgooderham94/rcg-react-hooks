import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  /* Empty array as second argument makes useEffect act the same as componentDidMount, only runs 
  'once' after the 'first' render. */
  useEffect(() => {
    fetch('https://rcg-react-hooks-ed0e9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json').then(
      response => response.json()
    ).then(
      responseData => {
        const loadedIngredients = [];

        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }

        setUserIngredients(loadedIngredients);
      }
    );
  }, []);

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
    setUserIngredients((prevIngredients) => prevIngredients.filter((ingredient) => {
      return ingredientId !== ingredient.id;
    }));
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search />
        
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}></IngredientList>
      </section>
    </div>
  );
}

export default Ingredients;
