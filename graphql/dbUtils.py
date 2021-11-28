from db import cursor

def usernameExists(username):
    cursor.execute(f"SELECT username FROM customer WHERE username = '{username}'")
    result = cursor.fetchall()
    return len(result) > 0

def gameExists(game):
    cursor.execute(f"SELECT title FROM game WHERE title = '{game}'")
    result = cursor.fetchall()
    return len(result) > 0

def hasPaymentInfo(username):
    if not username:
        return False
    cursor.execute(f"SELECT owned_by FROM payment_info WHERE owned_by = '{username}'")
    result = cursor.fetchall()
    return len(result) > 0
