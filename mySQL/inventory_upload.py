import mysql.connector
from mysql.connector import errorcode

file = open('Pantry_Inventory.csv', 'r')
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
        password= '******', #enter password here
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
   inventoryCursor = reservationConnection.cursor()

   inventoryCreate = ('CREATE TABLE Inventory ('
                'brand VARCHAR(100) PRIMARY KEY,'
                'simple_name VARCHAR(50),'
                'exp_date DATE,'
                'quantity TINYINT UNSIGNED,'
                'stock_date DATE)')

   inventoryCursor.execute(inventoryCreate)
   reservationConnection.commit()


   for row in rows:
      brand = row.pop(0)
      simple_name = row.pop(0)
      exp_date = row.pop(0)
      quantity = int(row.pop(0))

      if exp_date == 'TBD':
         exp_date = None

      insertQuery = ("INSERT INTO Inventory "
                  "(brand, simple_name, exp_date, quantity, stock_date) "
                  "VALUES (%s, %s, %s, %s, CURDATE())")

      values = (brand, simple_name, exp_date, quantity)
      inventoryCursor.execute(insertQuery, values)
      #print(inventoryCursor.fetchwarnings())   #prints any warnings that occur? idk
      reservationConnection.commit()
   
   inventoryCursor.close()

   print('success')
   reservationConnection.close()