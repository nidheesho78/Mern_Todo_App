import express from 'express';

const router = express.Router()
import { getConnectedClient } from '../data/db.js';

import { ObjectId } from 'mongodb';

const getCollection = async () => {
    const client = await getConnectedClient();
   const collection = client.db("todos").collection("todos");
    return collection;
}
//GET todos

router.get('/todos', async (req, res) => {
    const collection = await getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos)
})

//POST todos

router.post('/todos', async (req, res) => {
    const collection = await getCollection();
    let { todo } = req.body;

    if(!todo){
       return res.status(400).json({msg: "error no todo found"});
    }
    

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({todo, status: false})
    res.status(201).json({
        todo,
        status: false,
        _id: newTodo.insertedId 
    });
});

//DELETE todos

router.delete('/todos/:id', async (req, res) => {
    const collection = await getCollection();
    const _id = new ObjectId(req.params.id)

    const deletedTodo = await collection.deleteOne({_id});
    res.status(200).json(deletedTodo)
});

//UPDATE todos

router.put('/todos/:id', async (req, res) => {
    const collection = await getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if(typeof status !== "boolean"){
        return res.status(400).json({msg: "invalid status"})
    }

    const updatedTodo = await collection.updateOne({ _id },{ $set:{status: !status}})

    res.status(200).json(updatedTodo);
});



export default router