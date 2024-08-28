
from json import dumps
import os
from fastapi import APIRouter
from pymongo import MongoClient
from schema import Note


NoteRouter = APIRouter()

client = MongoClient(os.getenv('URI'))
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    database = client[os.getenv('COLLECTION')]
    collection = database[os.getenv('DB_NAME')]
except Exception as e:
    print(e)

@NoteRouter.get("/")
async def getNotes():
    documents =  list(collection.find({}))
    return {dumps(documents)}

@NoteRouter.post("/")
async def addNote(note: Note):
    collection.insert_one({'id':note.id,'content':note.content})
    return note

@NoteRouter.post("/{id}")
async def addNote(id:int, note: Note):
    collection.update_one({'id':id},{ '$set' :{'id':note.id,'content':note.content}})
    return note

@NoteRouter.delete("/{id}")
async def addNote(id:int):
    collection.delete_one({'id':id})
    return "deleted"