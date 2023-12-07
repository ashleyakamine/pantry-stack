import mysql.connector
from mysql.connector import errorcode

file = open('Recipe_cleanup2.csv', 'r')
file.readline()   # Skip headers line
rows = []

for line in file:
    current = [i for i in line.split(',')]
    current.pop()
    rows.append(current)
file.close()

try:
    reservationConnection = mysql.connector.connect(
        user='root',
        password='***',  # Enter password here
        host='localhost',
        database='plu_pantry'
    )

    recipeCursor = reservationConnection.cursor()

    recipeCreate = ('CREATE TABLE IF NOT EXISTS Recipes ('
                    'title VARCHAR(200) PRIMARY KEY,'
                    'link VARCHAR(100),'
                    'ingredients VARCHAR(1000))')

    recipeCursor.execute(recipeCreate)
    reservationConnection.commit()

    for row in rows:
        title = row[0]
        link = row[1]
        ingredients = ','.join(row[2:])

        insertQuery = ("INSERT INTO Recipes "
                       "(title, link, ingredients) "
                       "VALUES (%s, %s, %s)")

        values = (title, link, ingredients)
        recipeCursor.execute(insertQuery, values)
        reservationConnection.commit()

    # Recipe data cleaning
    updateTitles = "UPDATE Recipes SET title = REPLACE(REPLACE(title, '\"', ''), '*', '')"
    recipeCursor.execute(updateTitles)
    reservationConnection.commit()

    updateIngredients = "UPDATE Recipes SET ingredients = REPLACE(REPLACE(ingredients, '\"', ''), '*', '')"
    recipeCursor.execute(updateIngredients)
    reservationConnection.commit()

    recipeCursor.close()
    print('Success')

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print('Invalid credentials')
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print('Database not found')
    else:
        print('Cannot connect to database:', err)

finally:
    if reservationConnection.is_connected():
        reservationConnection.close()
