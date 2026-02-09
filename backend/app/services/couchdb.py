import requests
from app.core.config import get_settings

settings = get_settings()

COLLECTIONS = [
    "projects",
    "areas",
    "tasks",
    "resources",
    "habits",
    "metrics",
    "logs"
]

def ensure_user_databases(user_id: str):
    """
    Ensures that a CouchDB database exists for each collection for the given user.
    """
    base_url = settings.COUCHDB_URL
    auth = (settings.COUCHDB_USER, settings.COUCHDB_PASSWORD)
    
    print(f"Checking databases for user: {user_id}")
    
    for collection in COLLECTIONS:
        db_name = f"userdb-{user_id}-{collection}"
        url = f"{base_url}/{db_name}"
        
        # Check if DB exists
        response = requests.head(url, auth=auth)
        
        if response.status_code == 404:
            print(f"Creating database: {db_name}")
            create_response = requests.put(url, auth=auth)
            if create_response.status_code in [201, 202]:
                # [SECURITY FIX] Set permissions
                security_url = f"{url}/_security"
                security_obj = {
                    "admins": {"names": [settings.COUCHDB_USER], "roles": ["_admin"]},
                    "members": {"names": [user_id], "roles": []}
                }
                sec_response = requests.put(security_url, json=security_obj, auth=auth)
                if sec_response.status_code == 200:
                    print(f"Secured database: {db_name}")
                else:
                    print(f"Failed to secure database {db_name}: {sec_response.text}")
            else:
                print(f"Failed to create database {db_name}: {create_response.text}")
        elif response.status_code == 200:
             # Database exists, ensure security is set (Idempotency)
             security_url = f"{url}/_security"
             security_obj = {
                 "admins": {"names": [settings.COUCHDB_USER], "roles": ["_admin"]},
                 "members": {"names": [user_id], "roles": []}
             }
             requests.put(security_url, json=security_obj, auth=auth)
        else:
             print(f"Error checking database {db_name}: {response.status_code}")

