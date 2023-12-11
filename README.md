# PLU Pantry Client & Server 
## How to set up and use this website
To set up and run this site, follow the instructions below. 
### Set up database
1. In mySQL Workbench, create a schema called 'plu_pantry'
2. Open the inventory_upload.py file under the mySQL file and enter your mySQL password where asked
3. Run this file (might need to cd into mySQL file to work properly)
4. Open the recipe_upload.py file, enter your password, and run the file (will take a while to upload all the data)
### Open and run the website
1. Open the App.js file in the back-end folder and enter your mySQL password where asked
2. cd into back-end and type npm install into the terminal, then type npm start to connect to the database
3. Leave that terminal running and open a new terminal and cd into web-app
4. Run npm install and then npm start to open the website
