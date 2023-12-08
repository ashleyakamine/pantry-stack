const express = require('express');
const mysql = require('mysql2');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lahainagirls21!',
  database: 'plu_pantry',
});

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Successfully connected to the database.');
  }
});

const { ApolloServer, gql, ApolloError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.toLocaleDateString('en-US');
  },
  parseValue(value) {
    return new Date(value); 
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new ApolloError('Invalid Date');
  },
});

const typeDefs = gql`
  scalar Date

  type InventoryItem {
    id: ID!
    brand: String!
    simple_name: String
    quantity: Int
    stock_date: Date
    exp_date: Date
  }

  type Recipe {
    title: String!
    link: String!
    ingredients: String!
  }

  type Mutation {
    updateInventoryItem (
      id: ID!,
      brand: String!, 
      simple_name: String, 
      quantity: Int, 
      exp_date: Date, 
      stock_date: Date ) : InventoryItem

    addInventoryItem (
      brand: String!, 
      simple_name: String, 
      quantity: Int, 
      exp_date: Date, 
      stock_date: Date ) : InventoryItem

    deleteInventoryItem(
      id: ID! ) : Boolean
  }

  type Query {
    inventoryItems: [InventoryItem!]!
    recipeList: [Recipe!]! 
  }
`;

const resolvers = {
  Date: dateScalar, 
  Query: {
    inventoryItems: async () => {
      const query = 'SELECT * FROM plu_pantry.inventory';
      const [rows] = await connection.promise().query(query);

      return rows.map(row => ({
        ...row,
        exp_date: row.exp_date ? new Date(row.exp_date) : null,
        stock_date: row.stock_date ? new Date(row.stock_date) : null,
      }));
    },
    recipeList: async () => {
      const query = 'SELECT * FROM plu_pantry.recipes limit 1000';
      const [rows] = await connection.promise().query(query);

      return rows;
    },
  },

  Mutation: {
    updateInventoryItem: async (_, { id, brand, simple_name, quantity, exp_date, stock_date }) => {
      const query = `
        UPDATE plu_pantry.inventory
        SET brand = ?, simple_name = ?, quantity = ?, exp_date = ?, stock_date = ?
        WHERE id = ?
      `;
      const values = [brand, simple_name, quantity, exp_date, stock_date, id];
  
      try {
        await connection.promise().query(query, values);
        return { id, brand, simple_name, quantity, exp_date, stock_date };
      } catch (error) {
        throw new ApolloError('Failed to update the inventory item: ' + error.message);
      }
    },
    addInventoryItem: async (_, { brand, simple_name, quantity, exp_date, stock_date }) => {
      const query = `
        INSERT INTO plu_pantry.inventory (brand, simple_name, quantity, exp_date, stock_date)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [brand, simple_name, quantity, exp_date, stock_date];
    
      try {
        const [result] = await connection.promise().execute(query, values);
        const insertedId = result.insertId;  
        return { id: insertedId, brand, simple_name, quantity, exp_date, stock_date };
      } catch (error) {
        throw new ApolloError('Failed to add the inventory item: ' + error.message);
      }
    },
    deleteInventoryItem: async (_, { id }) => {
      const query = `
        DELETE FROM plu_pantry.inventory
        WHERE id = ?
      `;
      try {
        await connection.promise().execute(query, [id]);
        return true;
      } catch (error) {
        return new ApolloError('Failed to delete the inventory item: ' + error.message);
      }
    },
  },  
  
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
