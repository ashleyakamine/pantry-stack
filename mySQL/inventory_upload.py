import mysql.connector
from mysql.connector import errorcode

file = open('Pantry_Inventory.csv', 'r')
file.readline()   # Skip headers line
rows = []
for line in file:
   current = [i.strip() for i in line.split(',')]  # Added strip() to remove potential whitespace
   rows.append(current)
file.close()

try:
    reservationConnection = mysql.connector.connect(
        user='root',
        password='****',  # Enter password here
        host='localhost',
        database='plu_pantry'
    )

    inventoryCursor = reservationConnection.cursor()

    inventoryCreate = ('CREATE TABLE IF NOT EXISTS Inventory ('
                       'id INT AUTO_INCREMENT PRIMARY KEY,'
                       'brand VARCHAR(100),'
                       'simple_name VARCHAR(50),'
                       'exp_date DATE,'
                       'quantity TINYINT UNSIGNED,'
                       'stock_date DATE)')

    inventoryCursor.execute(inventoryCreate)
    reservationConnection.commit()

    for row in rows:
        brand = row[0]
        simple_name = row[1]
        exp_date = row[2] if row[2] != 'TBD' else None
        quantity = int(row[3])

        insertQuery = ("INSERT INTO Inventory "
                       "(brand, simple_name, exp_date, quantity, stock_date) "
                       "VALUES (%s, %s, %s, %s, CURDATE())")

        values = (brand, simple_name, exp_date, quantity)
        inventoryCursor.execute(insertQuery, values)
        reservationConnection.commit()
   
    inventoryCursor.close()
    print('Success')

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print('Invalid credentials')
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print('Database not found')
    else:
        print('Database error:', err)

finally:
    if reservationConnection.is_connected():
        reservationConnection.close()
