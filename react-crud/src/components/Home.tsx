import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { RandomInt } from '@/utility/helper';

interface Note {
  id: number;
  content: string;
}

const NotesApp: React.FC = () => {
  const [isLoading,setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({ id: 0, content: '' });

  async function getNotes(){
    await axios.get("http://127.0.0.1:8000/")
    .then((res) => {
        if(res!=null)
            setNotes(JSON.parse(res.data[0]))
    })
    .catch((err)=>{console.log(err)});
  }

  useEffect(() => {
    setLoading(true)
    getNotes()
    setLoading(false)
    console.log(notes)
  }, []);


async function addNote(id : number){
    setLoading(true)
    if(currentNote.content.trim()!='')
    {
        if(id == 0)
            await axios.post<Note[]>('http://127.0.0.1:8000/',{id: RandomInt(1,999), content: currentNote.content})
        else
            await axios.post<Note[]>('http://127.0.0.1:8000/'+id, {id:id, content: currentNote.content})
        setCurrentNote({ id: 0, content: '' });
        getNotes()
    }
    setLoading(false)

}

function editNote(note:Note)
{
    setCurrentNote(note);
}

async function deleteNote(id:number){
    await axios.delete(`http://127.0.0.1:8000/${id}`)
    setNotes(notes.filter(note => note.id !== id));

}


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Notes App</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{currentNote.id === 0 ? 'Add New Note' : 'Edit Note'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentNote.content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
              setCurrentNote({ ...currentNote, content: e.target.value })}
            placeholder="Enter your note here"
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={()=>addNote(currentNote.id)}>
            {currentNote.id === 0 ? 'Add Note' : 'Update Note'}
          </Button>
        </CardFooter>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note: Note) => (
          <Card key={note.id}>
            <CardContent className="pt-6">
              <p>{note.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => editNote(note)}>Edit</Button>
              <Button variant="destructive" onClick={() => deleteNote(note.id)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NotesApp;