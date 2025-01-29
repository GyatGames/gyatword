import os
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from generateGyatword import *
from dotenv import load_dotenv
from client import supa
import requests
import uvicorn
from starlette.requests import Request

from starlette.exceptions import HTTPException as StarletteHTTPException
from jose import jwt, JWTError




load_dotenv()


SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
GOOGLE_OAUTH_CLIENT_ID: str = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
GOOGLE_OAUTH_CLIENT_SECRET: str = os.getenv("GOOGLE_OAUTH_CLIENT_SECRET")
GOOGLE_OAUTH_REDIRECT_URI: str = os.getenv("GOOGLE_OAUTH_REDIRECT_URI")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

from pydantic import BaseModel, EmailStr

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


from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

# Custom HTTP exception handler
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": "*",  # Add your frontend origin
            "Access-Control-Allow-Credentials": "true",
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
        headers={"Access-Control-Allow-Origin": "*"},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"},
    )

@app.get("/")
async def root():
    return {"message": "Hello World"}


# Request model
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    username: str


class LogInRequest(BaseModel):
    email: EmailStr
    password: str

    # Pydantic model for response
class User(BaseModel):
    id: str
    username: str
    email: str

@app.post("/signup")
async def signup(user: SignUpRequest):
    """
    Handles user signup with email, password, and username.
    """
    try:
        # Validate input
        if not user.email or not user.password or not user.username:
            raise HTTPException(
                status_code=400, detail="Email, password, and username are required."
            )

        # Create user in Supabase Auth
        auth_response = supa.auth.sign_up(
            {"email": user.email, "password": user.password}
        )

        # Check for errors in the response
        if auth_response.user is None:
            raise HTTPException(
                status_code=400,
                detail=auth_response.error.message
                if auth_response.error
                else "Unknown authentication error.",
            )

        user_id = auth_response.user.id  # Accessing user ID correctly

        # Insert the username into the profiles table
        profile_response = (
            supa.table("profiles")
            .insert(
                {
                    "id": user_id,  # Ensure 'id' matches the primary key in the 'profiles' table
                    "username": user.username,
                    "email": user.email,
                }
            )
            .execute()
        )

        # Check for errors in profile response
        if "error" in profile_response and profile_response.error is not None:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to create user profile: {profile_response.error.message}",
            )

        # Return the JWT token and profile info
        return {
            "success": True,
            "access_token": auth_response.session.access_token,  # Access session correctly
            "refresh_token": auth_response.session.refresh_token,
            "user": {"id": user_id, "email": user.email, "username": user.username},
        }

    except KeyError as ke:
        # Handle missing keys in the response
        raise HTTPException(
            status_code=500, detail=f"Missing key in response: {str(ke)}"
        )
    except ValueError as ve:
        # Handle unexpected values
        raise HTTPException(status_code=400, detail=f"Value error: {str(ve)}")
    except Exception as e:
        # Catch-all for other exceptions
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


@app.post("/login")
async def login(user: LogInRequest):
    """
    Handles user login with email and password.
    """
    try:
        # Validate input
        if not user.email or not user.password:
            raise HTTPException(
                status_code=400, detail="Email and password are required."
            )

        # Authenticate user using Supabase
        response = supa.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        # Check if the response contains the expected session and user
        if not response or not response.session or not response.session.access_token:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        # Check if the user object exists
        if not response.user or not response.user.id:
            raise HTTPException(status_code=500, detail="Failed to retrieve user details.")

        # Check if the authentication was successful
        if not response.session or not response.session.access_token:
            raise HTTPException(status_code=401, detail="Invalid email or password.")
                
        
        
        # # Fetch user profile from Supabase

        # Fetch user profile from Supabase
        user_id = response.user.id  # Get the user ID from the authentication response
        profile_response = (
            supa.table("profiles").select("username").eq("id", user_id).execute()
        )
        # Check for errors in the profile query
        if hasattr(profile_response, "error") and profile_response.error:
            print(f"Supabase profile query error: {profile_response.error}")
            raise HTTPException(status_code=500, detail="Error fetching user profile.")

        # Ensure data exists in the profile response
        if not hasattr(profile_response, "data") or not profile_response.data:
            raise HTTPException(status_code=404, detail="User profile not found.")

        # Get the username from the profile response
        username = profile_response.data[0]["username"]

        # Return the access token, refresh token, and username
        return {
            "success": True,
            "message": "Login successful",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "username": username
        }

    except KeyError as ke:
        # Handle missing keys in the response
        raise HTTPException(
            status_code=500, detail=f"Missing key in response: {str(ke)}"
        )
    except ValueError as ve:
        # Handle unexpected values
        raise


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


@app.get("/getStreaks")
async def getStreaks(userID: str):  # Explicitly declare `userID` as a query parameter
    """
    Retrieve streak information for a given userID.
    """
    try:
        response = (
            supa.table("streaks")
            .select("*")
            .eq("id", userID)
            .execute()
        )

              # Check for errors in the profile query
        if hasattr(response, "error") and response.error:
            print(f"Supabase profile query error: {response.error}")
            raise HTTPException(status_code=500, detail="Error fetching user profile.")

        # Ensure data exists in the profile response
        if not hasattr(response, "data") or not response.data:
            raise HTTPException(status_code=404, detail="User profile not found.")

        if response.data:
            # Return max and current streaks
            return {
                "max_streak": response.data[0]["max_streak"],
                "current_streak": response.data[0]["current_streak"],
            }
        else:
            # Handle the case where no data is found
            raise HTTPException(
                status_code=404, detail="Streaks not found for the given user ID."
            )

    except Exception as e:
        # General error handling
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )


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
    sgt_timezone = timezone(timedelta(hours=8))
    today = datetime.now(sgt_timezone)

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
        print("token_response_data: ", token_response_data)
        raise HTTPException(status_code=400, detail="Failed to fetch access token")

    access_token = token_response_data.get("access_token")
    refresh_token = token_response_data.get("refresh_token")

    # Fetch user information
    user_info_response = requests.get(
        USER_INFO_URL, headers={"Authorization": f"Bearer {access_token}"}, timeout=10
    )
    user_info = user_info_response.json()

    # Check if the email already exists in the database
    existing_user_response = (
        supa.table("profiles").select("*").eq("email", user_info["email"]).execute()
    )

    if existing_user_response.data:
        # User exists, update last login time
        supa.table("profiles").update({"updated_at": today.isoformat()}).eq("email", user_info.get("email")).execute()

    else:
        # Insert new user into the database
        user_data = {
            "username": user_info.get("name"),
            "email": user_info.get("email"),
            "created_at": today.isoformat(),
            "oAuth_provider": 'google',
            "updated_at": today.isoformat(),
        }
        if refresh_token:
            user_data["refresh_token"] = refresh_token
        
        response = supa.table("profiles").insert(user_data).execute()
        print(response)

    # Redirect the user back to the frontend with tokens and username
    frontend_redirect_url = f"https://test-gyatword.deploy.jensenhshoots.com/auth/callback"
    query_params = {
        "access_token": access_token,
        "refresh_token": refresh_token if refresh_token else "",
        "username": user_info.get("name"),  # Include username
    }
    redirect_url = f"{frontend_redirect_url}?{requests.compat.urlencode(query_params)}"
    return RedirectResponse(redirect_url)

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
    remove_substrings_in_place(words)

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


@app.get("/me", response_model=User)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Verify the JWT token issued by Supabase and fetch the user profile.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        # Extract the token from the Authorization header
        token = authorization.split(" ")[1]

        # Decode the JWT token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], audience="authenticated")

        print(f"Decoded token payload: {payload}")


        # Extract user_id from the payload
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Fetch user profile from the Supabase `profiles` table
        profile_response = (
            supa.table("profiles")
            .select("id, username, email")
            .eq("id", user_id)
            .execute()
        )

        # Check for errors in the profile query
        if hasattr(profile_response, "error") and profile_response.error:
            print(f"Supabase profile query error: {profile_response.error}")
            raise HTTPException(status_code=500, detail="Error fetching user profile.")

        # Ensure data exists in the profile response
        if not hasattr(profile_response, "data") or not profile_response.data:
            raise HTTPException(status_code=404, detail="User profile not found.")

        # Return the user profile
        user_data = profile_response.data[0]
        return User(
            id=user_data["id"],
            username=user_data["username"],
            email=user_data["email"]
        )

    except JWTError as e:
        print(f"Token decoding error: {e}")

        raise HTTPException(status_code=401, detail="Invalid or expired token")
    

@app.post("/refresh")
async def refresh_token(refresh_token: str = Body(...)):
    """
    Refresh access token using the provided refresh token.
    """
    try:
        # Verify the refresh token
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token.")

        # Generate a new access token
        access_token = jwt.encode(
            {"sub": user_id, "exp": datetime.utcnow() + timedelta(minutes=15)},
            JWT_SECRET,
            algorithm=JWT_ALGORITHM,
        )

        # Optionally: Generate a new refresh token (rotate)
        new_refresh_token = jwt.encode(
            {"sub": user_id, "exp": datetime.utcnow() + timedelta(days=30)},
            JWT_SECRET,
            algorithm=JWT_ALGORITHM,
        )

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "user": {"id": user_id},  # Include other user details if needed
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

def remove_substrings_in_place(words):
    """
    Remove any word in the list that is a substring of another word, modifying the array in-place.

    Args:
        words (list of str): List of words to process.
    """
    # Sort words by length (longest first) to ensure substrings are processed correctly
    words.sort(key=len, reverse=True)

    # Check and remove substrings
    i = 0
    while i < len(words):
        word = words[i]
        # Check if the word is a substring of any other word in the list
        if any(word in other for other in words if word != other):
            words.pop(i)  # Remove the word if it's a substring
        else:
            i += 1  # Move to the next word if it's not a substring


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


