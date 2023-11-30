const express = require('express');
const mysql = require('mysql2');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '********',
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
    brand: String!
    simple_name: String
    exp_date: Date
    quantity: Int!
    stock_date: Date
  }

  type Recipe {
    title: String!
    link: String!
    ingredients: String!
  }

  type Mutation {
    updateInventoryItem(brand: String!, simple_name: String, quantity: Int, exp_date: Date, stock_date: Date): InventoryItem
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
      const query = 'SELECT * FROM plu_pantry.recipes limit 200';
      const [rows] = await connection.promise().query(query);

      return rows;
    },
  },

  Mutation: {
    updateInventoryItem: async (_, { brand, simple_name, quantity, exp_date, stock_date }) => {
      // Construct the SQL query for updating
      const query = `
        UPDATE plu_pantry.inventory
        SET simple_name = ?, quantity = ?, exp_date = ?, stock_date = ?
        WHERE brand = ?
      `;
      const values = [simple_name, quantity, exp_date, stock_date, brand];

      try {
        await connection.promise().query(query, values);
        return { brand, simple_name, quantity, exp_date, stock_date };
      } catch (error) {
        throw new ApolloError('Failed to update the inventory item: ' + error.message);
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
