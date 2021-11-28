import psycopg2

POSTGRES_PASSWORD = 123

connection = psycopg2.connect(
        database="game_store",
        user='postgres',
        password=POSTGRES_PASSWORD,
        host="localhost",
        port=5432
    )

cursor = connection.cursor()