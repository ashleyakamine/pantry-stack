const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mysql = require('mysql2');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lahainagirls21!', // Replace with your database password
  database: 'plu_pantry',
});

connection.connect((error) => {
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Successfully connected to the database.');
  }
});

const typeDefs = gql`
  type InventoryItem {
    brand: String!
    simple_name: String!
    exp_date: String!
    quantity: Int!
    stock_date: String!
  }

  type Query {
    inventoryItems: [InventoryItem!]!
  }
`;

const resolvers = {
  Query: {
    inventoryItems: async () => {
      const query = 'SELECT * FROM plu_pantry.inventory';
      const [rows] = await connection.promise().query(query);

      return rows;
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
