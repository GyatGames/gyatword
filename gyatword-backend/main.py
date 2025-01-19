from fastapi import FastAPI
from generateGyatword import *
from fastapi.middleware.cors import CORSMiddleware
from client import supa
import json
import uvicorn
from datetime import datetime, timedelta, timezone

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/getGyatword")
async def getGyatword():
    sgt_timezone = timezone(timedelta(hours=8))
    today = datetime.now(sgt_timezone).date() #makes sure its SG Time

    # Check if a record for today's date exists
    response = supa.table("archive").select("*").eq("date_created", today.isoformat()).execute()

    if response.data:
        return response.data[0]["data"]
    else:
        result = generateGyatword()
        gyatword = result[0] # generates crossword using scala file
        #print(gyatword)
        wordlist = result[1]
        clues = fetch_clues_from_supabase()
        result = process_array(gyatword, wordlist, clues)
        supa.table("archive").insert({
            "date_created": today.isoformat(),
            "data": result
        }).execute()

        return result #json.dumps(result, indent=2)

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