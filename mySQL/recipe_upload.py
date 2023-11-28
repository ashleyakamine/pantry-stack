import mysql.connector
from mysql.connector import errorcode

file = open('Recipe_cleanup2.csv', 'r')
file.readline()   #skip headers line
rows = []

for line in file:
   current = [i for i in line.split(',')]
   current.pop()
   rows.append(current)
file.close()

try:
    reservationConnection = mysql.connector.connect(
        user='root',
        password= '***', #enter password here
        host='localhost',
        database='plu_pantry'
    )

except mysql.connector.Error as err:
   if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
      print('Invalid credentials')
   elif err.errno == errorcode.ER_BAD_DB_ERROR:
      print('Database not found')
   else:
      print('Cannot connect to database:', err)

else:
   recipeCursor = reservationConnection.cursor()

   recipeCreate = ('CREATE TABLE Recipes ('
                'title VARCHAR(200) PRIMARY KEY,'
                'link VARCHAR(100),'
                'ingredients VARCHAR(1000))')

   recipeCursor.execute(recipeCreate)
   reservationConnection.commit()


   for row in rows:
      title = row.pop(0)
      link = row.pop(0)
      ingredients = ','.join(row)

      insertTestQuery = ("INSERT INTO Recipes "
                  "(title, link, ingredients) "
                  "VALUES (%s, %s, %s)")

      values = (title, link, ingredients)
      recipeCursor.execute(insertTestQuery, values)
      reservationConnection.commit()
   
   recipeCursor.close()

   print('success')
   reservationConnection.close()