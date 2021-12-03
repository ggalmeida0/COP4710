from ariadne import QueryType, MutationType
from db import connection,cursor
from dbUtils import hasPaymentInfo, usernameExists, gameExists
from datetime import datetime

query = QueryType()
mutations = MutationType()



# Customer APIs

@query.field("login")
def resolveLogin(*_,username,passwordHash):
    try:
        cursor.execute(f"SELECT username FROM customer WHERE username = '{username}' AND passwordHash = '{passwordHash}'")
        result = cursor.fetchone()
        return len(result[0]) > 0
    except Exception as e:
        print(f"error while selecting from db:\n{e}")
        return False

@mutations.field("signUp")
def resolveSignUp(*_,user):
    if len(user["username"]) == 0:
        return {"success":False, "message":"username cannot be empty"}
    elif usernameExists(user["username"]):
        return {"success":False, "message":"username exists"}
    elif len(user["passwordHash"]) == 0:
        return {"success":False, "message": "password cannot be empty"}
    query = f"""INSERT INTO
                customer({",".join([key for key in user])})
                VALUES({",".join(["'" + user[key] + "'" for key in user])})
           """
    try:
        with connection:
            cursor.execute(query)
        return {"success":True} 
    except Exception as e:
        print(f"error occured while inserting into the db: {e}")
        return {"success":False,"message":"There was an error with sign up"}


# Cart APIs

@mutations.field("addToCart")
def resolveAddToCart(*_,username,gameTitle):
    if not usernameExists(username): 
        return {"success":False, "message":"username does not exist"}
    elif not gameExists(gameTitle):
        return {"success":False, "message":"game does not exist"}
    try:
        with connection:
            cursor.execute(f"INSERT INTO cart(cust_name, game_name) VALUES('{username}','{gameTitle}')")
        return {"success":True}
    except Exception as e:
        return {"success":False, "message":f"error occured while inserting into db:\n{e}"}

@mutations.field("removeFromCart")
def resolveRemoveFromCart(*_,username,gameTitle):
    if not usernameExists(username): 
        return {"success":False, "message":"username does not exist"}
    elif not gameExists(gameTitle):
        return {"success": False, "message":"game does not exist"}
    try:
        with connection:
            cursor.execute(f"DELETE FROM cart WHERE cust_name = '{username}' AND game_name = '{gameTitle}'")
        return {"success":True}
    except Exception as e:
        return {"success":False, "message": f"error while deleting from db:\n{e}"}

@query.field("getCartContent")
def resolve_getCartContent(*_,username):
    if not usernameExists(username): 
        print(f"user {username} does not exist so can't get cart")
        return []
    try:
        cursor.execute(f"SELECT title, physical_quantity, genre, description, developer, rating, cost FROM cart INNER JOIN game ON title = game_name WHERE cust_name = '{username}'")
        keys = ("title","qty","genre","description","developer","rating","cost")
        rawResults = cursor.fetchall()
        formatedResult = []
        for rawResult in rawResults:
            game = {}
            for i, key in enumerate(keys):
                game[key] = rawResult[i]
            formatedResult.append(game)
        return formatedResult
    except Exception as e:
        print(f"error while selecting from db:\n{e}")
        return []

# Games API

@query.field("getAllGames")
def resolve_getAllGames(*_):
    try:
        cursor.execute(f"SELECT * FROM game")
        rawResults = cursor.fetchall()
        keys = ("title","qty","genre","description","developer","rating","cost")
        result = []
        for rawResult in rawResults:
            game = {}
            for i,key in enumerate(keys):
                game[key] = rawResult[i]
            result.append(game)
        return result
    except Exception as e:
        print(f"error while fetching games from db:\n {e}")
        return []


@mutations.field("storeOrder")
def resolve_storeOrder(*_,order):
    TAX_RATE = 0.1
    try:
        query = f"""
        INSERT INTO orders(
            date_placed,
            total,
            ordered_by,
            card_user,
            card_number,
            tax_rate,
            zip,
            country,
            state,
            city,
            street_address,
            expiration_date,
            csv_code,
            name_on_card
        ) 
        VALUES(
            '{datetime.now().isoformat()[:10]}',
            '{order["total"]}',
            '{order["ordered_by"]}',
            '{order["ordered_by"]}',
            '{order["card_number"]}',
            {TAX_RATE},
            '{order["zip"]}',
            '{order["country"]}',
            '{order["state"]}',
            '{order["city"]}',
            '{order["street_address"]}',
            '{order["expiration_date"]}',
            '{order["csv_code"]}',
            '{order["name_on_card"]}'
        );
        """
        with connection: cursor.execute(query)
        cursor.execute("SELECT last_value from orders_order_id_seq")
        orderId = cursor.fetchone()[0]
        with connection:
            print(order["games"])
            for game in order["games"]:
                if game == '': continue
                query = f"""
                WITH game_cost AS (SELECT cost FROM game WHERE title = '{game}')
                INSERT INTO order_contains(
                    is_physical,
                    order_id,
                    game,
                    cost_when_ordered,
                    game_title_when_ordered
                )
                VALUES(true,{orderId},'{game}',(SELECT cost FROM game_cost),'{game}')
                        """
                cursor.execute(query)
        return orderId
    except Exception as e:
        print(f"error while inserting order, threw exception:\n {e}")

@mutations.field("clearCart")
def resolve_clearCart(*_,username):
    if not usernameExists(username):
        return {"success":False, "message":"username does not exist"} 
    try:
        with connection: cursor.execute(f"DELETE FROM cart WHERE cust_name = '{username}'")
        return {"success":True}
    except Exception as e:
        return {"success":False, "message":"there was an error while clearing the cart: {e}"}

@query.field("getLatestOrder")
def resolve_getLatestOrder(*_,username):
    try:
        query = f"""
            SELECT
                ordered_by,
                zip,
                country,
                state,
                city,
                street_address,
                expiration_date,
                csv_code,
                card_number,
                name_on_card
            FROM orders WHERE ordered_by = '{username}'
            ORDER BY order_id DESC
            LIMIT 1
        """
        cursor.execute(query)
        rawResult = cursor.fetchone()
        if not rawResult: return {}
        keys = ("ordered_by","zip","country","state","city","street_address","expiration_date","csv_code","card_number","name_on_card")
        formatedResult = dict(zip(keys,rawResult))
        return formatedResult
    except Exception as e:
        print(f"error while geting order from db, with exception: \n {e}")