import subprocess
import re
from client import supa
import random

def generateGyatword():
    # Path to the Scala JAR file
    jar_path = "generator.jar"
    
    density = 0
    words = 0

    def fetch_words_from_supabase():
        """
        Query the Supabase 'words' table to fetch the list of words.
        Returns a list of words.
        """
        response = supa.table("words").select("*").execute()
    
        if response.data:
            return [item["word"] for item in response.data]
        else:
            return []

    def getResults():
        #get list of words from supabase and save it to a temporary word file
        allwords = fetch_words_from_supabase()
        random.shuffle(allwords)
        wordlist = allwords[0:40]  
        with open("temp_wordlist.txt", "w") as f:
            f.write("\n".join(wordlist))

        # Run the Scala application and capture the output
        result = subprocess.run(["java", "-jar", jar_path, "12", "12", "temp_wordlist.txt"], capture_output=True, text=True)
        lines = result.stdout.splitlines()
        # Print the output
        first_line = lines[0]
        
        # Extract density and words using regular expressions
        density_match = re.search(r'Density:\s*([\d.]+)%', first_line)
        words_match = re.search(r'Words:\s*(\d+)', first_line)
    
        if density_match and words_match:
            nonlocal density, words
            density = int(density_match.group(1))
            words = int(words_match.group(1))
            
        array = []
        for line in lines[1:]:
            array.append(list(line))
        return [array, wordlist]
    
    max_retries = 10000000000  # Set a maximum number of retries
    retries = 0
    result = []
    while (density < 50 or words < 10) and retries < max_retries:
        result = getResults()
        retries += 1
        
        #print("Density:", density)
        #print("Words:", words)
    #print(finalArray)
    return result
# Call the function
#generateCrossword()