# client.py

from supabase import create_client, Client
import os

SUPABASE_URL: str = os.getenv('SUPABASE_URL')
SUPABASE_KEY: str =  os.getenv('SUPABASE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or Key is not set in the environment variables")

supa: Client = create_client(SUPABASE_URL, SUPABASE_KEY)