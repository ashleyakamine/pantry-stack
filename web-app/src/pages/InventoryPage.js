import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL query
const GET_INVENTORY = gql`
  query GetInventory {
    inventoryItems { 
      brand
      simple_name
      quantity
      stock_date
    }
  }
`;

export function InventoryPage() {
  // Execute the query using useQuery
  const { loading, error, data } = useQuery(GET_INVENTORY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Render the data
  return (
    <ul>
      {data.inventoryItems.map(item => (
        <li key={item.brand}>
          {item.brand}: {item.quantity}
        </li>
      ))}
    </ul>
  );
}
