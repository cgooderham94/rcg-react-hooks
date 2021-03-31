import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    setUserIngredients((prevIngredients) => [...prevIngredients, {
      id: Math.random().toString(),
      ...ingredient
    }]);
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
