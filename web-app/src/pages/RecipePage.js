import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL query
const GET_RECIPES = gql`
  query GetRecipes {
    recipeList{ 
      title
      link
      ingredients
    }
  }
`;

export function RecipePage() {
  // Execute the query using useQuery
  const { loading, error, data } = useQuery(GET_RECIPES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Render the data
  return (
    <ul>
      {data.recipeList.map(recipe => (
        <li key={recipe.title}>
          {recipe.title}: {recipe.ingredients}: {recipe.link}
        </li>
      ))}
    </ul>
  );
}
