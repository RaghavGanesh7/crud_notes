from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from bson.json_util import dumps
from schema import Note
from dotenv import load_dotenv
import os


from pymongo import MongoClient

app = FastAPI()

load_dotenv()
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Connect to Mongo database
client = MongoClient(os.getenv('URI'))
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    database = client[os.getenv('COLLECTION')]
    collection = database[os.getenv('DB_NAME')]
except Exception as e:
    print(e)



@app.get("/")
async def getNotes():
    documents =  list(collection.find({}))
    return {dumps(documents)}

@app.post("/")
async def addNote(note: Note):
    collection.insert_one({'id':note.id,'content':note.content})
    return note

@app.post("/{id}")
async def addNote(id:int, note: Note):
    collection.update_one({'id':id},{ '$set' :{'id':note.id,'content':note.content}})
    return note

@app.delete("/{id}")
async def addNote(id:int):
    collection.delete_one({'id':id})
    return "deleted"