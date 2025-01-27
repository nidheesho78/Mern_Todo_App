import { useEffect, useState } from "react";
import Todo from "./Todo";
import { toast, ToastContainer } from "react-toastify"; // Importing toast
import "react-toastify/dist/ReactToastify.css"; // Importing the toast CSS
import { FaRegSadTear } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';



function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);

  // Fetch todos on initial load
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
  }, []);

  // Handle form submission (create or update todo)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (content.length > 3) {
      if (editingTodoId) {
        // Update existing todo
        const res = await fetch(`/api/todos/${editingTodoId}`, {
          method: "PATCH",
          body: JSON.stringify({ todo: content }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const updatedTodo = await res.json();
          console.log("Updated Todo:", updatedTodo); // Debugging log

          // Update the todo in the local state immediately after success
          setTodos((currentTodos) =>
            currentTodos.map((todo) =>
              todo._id === editingTodoId
                ? { ...todo, todo: updatedTodo.todo }
                : todo
            )
          );

          toast.success("Todo updated successfully!"); // Toast on success
        } else {
          toast.error("Failed to update todo."); // Toast on failure
        }
        setEditingTodoId(null); // Reset editing state
      } else {
        // Create new todo
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const newTodo = await res.json();
          setTodos([...todos, newTodo]);
          toast.success("Todo created successfully!"); // Toast on success
        } else {
          toast.error("Failed to create todo."); // Toast on failure
        }
      }
      setContent(""); // Clear input field
    }
  };

  // Start editing a todo
  const startEditingTodo = (todoId, existingContent) => {
    setEditingTodoId(todoId);
    setContent(existingContent);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTodoId(null);
    setContent("");
  };

  <ToastContainer 
  position="top-right"
  autoClose={1000} 
  hideProgressBar
  newestOnTop
  closeButton
  rtl={false}
/>


  return (
    <main className="container">
      <div>
 <h1 className="title">
        Taskify
  <AiOutlineCheckCircle className="icon_title" /> 
</h1>
      </div>
     


      <form className="form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form_input"
          required
        />
        <div>
          <button
            className={`button ${editingTodoId ? "button-update" : "button-create"}`}
            type="submit"
          >
            {editingTodoId ? "Update Todo" : "Create Todo"}
          </button>
          {editingTodoId && (
            <button className="button button-cancel" type="button" onClick={cancelEditing}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="todos">
        {todos.length === 0 ? (
          <div className="no-todos">
          <FaRegSadTear size={50} /> {/* Icon size */}
          <p>No todos available yet. Add your first task!</p>
        </div>
        ) : (
          todos.map((todo) => (
            <Todo
              key={todo._id}
              todo={todo}
              setTodos={setTodos}
              startEditingTodo={startEditingTodo}
            />
          ))
        )}
      </div>
      <ToastContainer /> {/* Add ToastContainer here */}
    </main>
  );
}

export default App;
