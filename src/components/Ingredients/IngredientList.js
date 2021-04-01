import React from 'react';

import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientList.css';

const IngredientList = props => {
  return (
    <section className="ingredient-list">
      <div className="ingredient-list__heading-wrapper">
        <h2>Loaded Ingredients</h2>
        { props.loading && <LoadingIndicator /> }
      </div>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
