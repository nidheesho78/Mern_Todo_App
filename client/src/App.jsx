import { useEffect, useState } from "react";
import Todo from "./Todo";


function App() {

const [todos, setTodos] = useState([])
const [content, setContent] = useState("")

  useEffect(() => {
    const getTodos = async () => {
       try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };
    getTodos();
  }, [])


  const createNewTodo = async (e) => {
e.preventDefault();
if(content.length > 3) {
  const res = await fetch("/api/todos", {
    method : "POST",
    body: JSON.stringify({todo : content}),
    headers : {
      "Content-Type" : "application/json",
    },
  });
  const newTodo = await res.json();

  setContent("");
  setTodos([...todos, newTodo]);
}
  }
  return (
 <main className="container">
    <h1 className="title">Task World</h1>
    <form className="form" onSubmit={createNewTodo}>
      <input type="text"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Enter a new todo..."
      className="form_input"
      required
      />
      <button className='form_button' type="submit">Create Todo</button>
    </form>
    <div className="todos">
    {todos.length === 0 ? (
      <p>No todos available or loading...</p>
    ) : (
      todos.map((todo) => (
       <Todo key={todo._id} todo={todo} setTodos={setTodos} />
      ))
    )}
    </div>
  </main>
);
}

export default App;
