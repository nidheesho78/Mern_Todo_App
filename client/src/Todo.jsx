import React from 'react'

const Todo = (props) => {

    const {todo, setTodos} = props;


    const updateTodo = async (todoId, todoStatus) => {

        const res = await fetch(`/api/todos/${todoId}`,{
            method: "PUT",
            body: JSON.stringify({status: todoStatus}),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const json = await res.json();
        if(json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if(currentTodo._id === todoId) {
                        return {...currentTodo, status: !currentTodo.status};
                    }
                     return currentTodo;
                })
            })
        }

    }


    const deleteTodo = async (todoId) => { 
        const res = await fetch(`/api/todos/${todoId}`, {
            method: 'DELETE',     
        })
        const json = await res.json();
        if(json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos
                .filter((currentTodo) => currentTodo._id !== todoId);
            })
        }
    }
  return (
   
         <div className="todo">
          <p>{todo.todo}</p>
          {console.log(todo)}
          <div className='mutations'>
            <button className="todo_status"
            onClick={() => updateTodo(todo._id, todo.status)}>
               {(todo.status) ? "☑" : "☐"}
            </button>
            <button className='todo_delete'
            onClick={() => deleteTodo(todo._id)}  >
                🗑️
            </button>
          </div>
        </div>
    
  )
}

export default Todo