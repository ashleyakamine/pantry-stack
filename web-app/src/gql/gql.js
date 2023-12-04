import { gql } from '@apollo/client';

// GraphQL query
export const GET_INVENTORY = gql`
  query GetInventory {
    inventoryItems { 
      id
      brand
      simple_name
      quantity
      stock_date
      exp_date
    }
  }
`;

export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($id: ID!, $brand: String!, $simple_name: String, $quantity: Int, $exp_date: Date, $stock_date: Date) {
    updateInventoryItem(id: $id, brand: $brand, simple_name: $simple_name, quantity: $quantity, exp_date: $exp_date, stock_date: $stock_date) {
      id
      brand
      simple_name
      quantity
      exp_date
      stock_date
    }
  }
`;

export const DELETE_INVENTORY_ITEM = gql`
  mutation DeleteInventoryItem($id: ID!) {
    deleteInventoryItem(id: $id )
  }
`;

export const ADD_INVENTORY_ITEM = gql`
mutation AddInventoryItem($brand: String!, $simple_name: String, $quantity: Int, $exp_date: Date, $stock_date: Date) {
  addInventoryItem(brand: $brand, simple_name: $simple_name, quantity: $quantity, exp_date: $exp_date, stock_date: $stock_date) {
    id
    brand
    simple_name
    quantity
    exp_date
    stock_date
  }
}
`;