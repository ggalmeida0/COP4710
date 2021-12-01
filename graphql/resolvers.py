from ariadne import QueryType, MutationType
from db import connection,cursor
from dbUtils import hasPaymentInfo, usernameExists, gameExists

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

@mutations.field("updateUser")
def resolveUpdateUser(*_,user):
    if not usernameExists(user["username"]):
        return "username does not exist"
    query = f"""UPDATE customer SET({",".join([key for key in user])})
                = ({",".join(["'" + user[key] + "'" for key in user])})
            """
    try:
        with connection:
            cursor.execute(query)
        return "success"
    except Exception as e:
        return f"error occured while updating db: {e}"




# Cart APIs

@mutations.field("addToCart")
def resolveAddToCart(*_,username,gameTitle):
    if not usernameExists(username): 
        return "username does not exist"
    elif not gameExists(gameTitle):
        return "game does not exist"    
    try:
        with connection:
            cursor.execute(f"INSERT INTO cart(cust_name, game_name) VALUES({username},{gameTitle})")
        return "success"
    except Exception as e:
        return f"error occured while inserting into db:\n{e}"

@mutations.field("removeFromCart")
def resolveRemoveFromCart(*_,username,gameTitle):
    if not usernameExists(username): 
        return "username does not exist"
    elif not gameExists(gameTitle):
        return "game does not exist"
    try:
        with connection:
            cursor.execute(f"DELETE FROM cart WHERE cust_name = '{username}' AND game_name = '{gameTitle}'")
        return "success"
    except Exception as e:
        return f"error while deleting from db:\n{e}"

@query.field("getCartContent")
def resolve_getCartContent(*_,username):
    if not usernameExists(username): 
        return "username does not exist"
    try:
        cursor.execute(f"SELECT game_name FROM cart WHERE cust_name = '{username}'")
        return cursor.fetchall()
    except Exception as e:
        return f"error while selecting from db:\n{e}"

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


#Payment Info API:

@query.field("getPaymentInfo")
def resolve_getPaymentInfo(*_,username):
    if not usernameExists(username):
        print(f"error, username {username} doest not exist")
        return False
    try:
        cursor.execute(f"SELECT * FROM payment_info WHERE owned_by  = '{username}'")
        rawResults = cursor.fetchone()
        keys = ("owned_by","expiration_date","csv_code","card_number","zipcode","country","state","city","street_address","name_on_card")
        formatedResult = dict(zip(keys,rawResults))
        return formatedResult
    except Exception as e:
        print(f"error while fetching paymentInfo from db:\n{e}")
        return []

@mutations.field("storePaymentInfo")
def resolve_storePaymentInfo(*_,paymentInfo):
    username = paymentInfo["owned_by"]
    if not usernameExists(username):
        print(f"username {username} is invalid")
        return False
    elif hasPaymentInfo(username):
        paymentInfo.pop("owned_by")
        try:
            query = f""" UPDATE payment_info
                    SET ({",".join([key for key in paymentInfo])})
                    = ({",".join(["'" + paymentInfo[key] + "'" for key in paymentInfo])})
                    WHERE owned_by = '{username}'
            """
            with connection: cursor.execute(query)
            return True
        except Exception as e:
            print(f"error while updating payment info from {username}:\n{e}")
            return False
    else:
        query = f""" INSERT INTO
                    payment_info({",".join([key for key in paymentInfo])})
                    VALUES({",".join(["'" + paymentInfo[key] + "'" for key in paymentInfo])})
        """
        try:
            with connection:
                cursor.execute(query)
            return True
        except Exception as e:
            print(f"error occured while inserting into the db:\n {e}")
            return False