import os
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from generateGyatword import *
from dotenv import load_dotenv
from client import supa
import requests
import uvicorn


load_dotenv()


SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
GOOGLE_OAUTH_CLIENT_ID: str = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET: str = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
GOOGLE_OAUTH_REDIRECT_URI: str = os.getenv("GOOGLE_OAUTH_REDIRECT_URI")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Google OAuth URLs
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/getGyatword")
async def getGyatword():
    sgt_timezone = timezone(timedelta(hours=8))
    today = datetime.now(sgt_timezone).date()  # makes sure its SG Time

    # Check if a record for today's date exists
    response = (
        supa.table("archive")
        .select("*")
        .eq("date_created", today.isoformat())
        .execute()
    )

    if response.data:
        return response.data[0]["data"]
    else:
        result = generateGyatword()
        gyatword = result[0]  # generates crossword using scala file
        # print(gyatword)
        wordlist = result[1]
        clues = fetch_clues_from_supabase()
        result = process_array(gyatword, wordlist, clues)
        supa.table("archive").insert(
            {"date_created": today.isoformat(), "data": result}
        ).execute()

        return result  # json.dumps(result, indent=2)


@app.get("/oAuth_login")
def oAuth_login():
    """
    Redirect the user to Supabase Google OAuth login page.
    """
    query_params = {
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
    }
    redirect_url = f"{AUTH_URL}?{requests.compat.urlencode(query_params)}"
    return RedirectResponse(redirect_url)


@app.get("/oAuth_callback")
def oAuth_callback(code: str):
    """
    Handles the callback from Google with the authorization code.
    """
    # Exchange authorization code for access token
    token_data = {
        "code": code,
        "client_id": GOOGLE_OAUTH_CLIENT_ID,
        "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
        "redirect_uri": GOOGLE_OAUTH_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    token_response = requests.post(TOKEN_URL, data=token_data, timeout=10)
    token_response_data = token_response.json()

    if "error" in token_response_data:
        raise HTTPException(status_code=400, detail="Failed to fetch access token")

    access_token = token_response_data["access_token"]

    # Fetch user information
    user_info_response = requests.get(
        USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"}, timeout=10
    )
    user_info = user_info_response.json()

    # Check if the email already exists in the database
    existing_user_response = supa.table("profiles").select("*").eq("email", user_info["email"]).execute()

    if existing_user_response.data:
        return {"message": "User already exists", "user_info": user_info}

    # Insert user information into Supabase database
    user_data = {
        "username": user_info["name"],
        "email": user_info["email"],
        "created_at": datetime.utcnow().isoformat()
    }
    response = supa.table("profiles").insert(user_data).execute()
    print(response)

    return {"message": "Authentication successful", "user_info": user_info}


def fetch_clues_from_supabase():
    response = supa.table("words").select("*").execute()

    if response.data:
        return {item["word"]: item["definition"] for item in response.data}
    else:
        return {}


def process_array(grid, words, clues):
    crossword = {"across": {}, "down": {}}
    rows = len(grid)
    cols = len(grid[0])
    word_count = 1

    for row in range(rows):
        for col in range(cols):
            if grid[row][col] in (" ", "#"):
                continue
            word_found = False
            for word in words:
                if "".join(grid[row][col : col + len(word)]) == word:
                    crossword["across"][word_count] = {
                        "clue": clues[word] if word in clues else "test",
                        "answer": word.upper(),
                        "row": row,
                        "col": col,
                    }
                    word_found = True
                    words.remove(word)
                if row + len(word) <= rows:
                    vertical_word = "".join(
                        grid[row + i][col] for i in range(len(word))
                    )
                    if vertical_word == word:
                        crossword["down"][word_count] = {
                            "clue": clues[word] if word in clues else "test",
                            "answer": word.upper(),
                            "row": row,
                            "col": col,
                        }
                        word_found = True
                        words.remove(word)

            if word_found:
                word_count += 1

    return crossword


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
