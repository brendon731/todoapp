import React, { useCallback, useState, useEffect } from "react";
import "./index.css";
import "./model.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  
} from "@fortawesome/free-solid-svg-icons";

let random = 10;
export default function App() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [view, setView] = useState([]);
  const [select, setSelect] = useState("all");
  const [open, isOpen] = useState(false);
  const [edit, setEdit] = useState([]);

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      setTodoList([
        {
          item: todo,
          id: (random += 1),
          done: false
        },
        ...todoList
      ]);
      setTodo("");
    },
    [setTodoList, todo, todoList]
  );
  
  useEffect(() => {
    if(JSON.parse(localStorage.getItem("todolist/user"))===null){ 
      setTodoList([])
    }else{
      setTodoList(JSON.parse(localStorage.getItem("todolist/user")));
    }
  }, []);
  
  useEffect(() => {
    
    localStorage.setItem("todolist/user", JSON.stringify(todoList));
    setView([...todoList]);
  }, [todoList]);

  const handleCheck = useCallback(
    (e, i, evt) => {
      const newtodo = [...todoList];
      newtodo[i].done = !newtodo[i].done;
      setTodoList(newtodo);
    },
    [todoList]
  );

  useEffect(() => {
    switch (select) {
      case "Done":
        return setView(
          todoList.filter((e) => {
            return e.done;
          })
        );

      case "To Do":
        return setView(
          todoList.filter((e) => {
            return !e.done;
          })
        );

      default:
        return setView([...todoList]);
    }
  }, [select, setView, todoList]);

  const handledark = useCallback(() => {
    document.getElementById("root").parentElement.classList.toggle("dark");
  }, []);

  const handleRemove = useCallback(
    (id) => {
      if(window.confirm("Are you sure you want to remove?")){

        setTodoList(
          todoList.filter((e) => {
            return e.id !== id;
          })
        )
      }
      
    },
    [setTodoList, todoList]
  );

  const handleEdit = useCallback(
    (evt, id) => {
      isOpen(!open);
      setEdit([evt.item, id]);
    },
    [isOpen, open, setEdit]
  );

  const handleEditing = useCallback(
    (evt) => {
      setEdit([evt.target.value, edit[1]]);
    },
    [setEdit, edit]
  );

  const handleConfirm = useCallback(() => {
    isOpen(!open);

    setTodoList(
      todoList.map((e) => {
        if (e.id === edit[1]) {
          return {
            item: edit[0],
            id: e.id,
            done: e.done
          };
        } else {
          return e;
        }
      })
    );
  }, [setTodoList, todoList, open, isOpen, edit]);

  return (
    <div className="main">
      <label>
        <input hidden type="checkbox" id="checkbox" onChange={handledark} />
        <span></span>
      </label>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={todo}
          onChange={(evt) => {
            setTodo(evt.target.value);
          }}
        />
        <input type="submit" value="Add todo"/>
      </form>

      <select
        onChange={(evt) => {
          setSelect(evt.target.value);
        }}
      >
        <option>All</option>
        <option>Done</option>
        <option>To Do</option>
      </select>

      {view.map((e, i) => {
        return (
          <>
            <div className={open ? "open" : "hidden"}>
              <section className="section">
                <input onChange={handleEditing} type="text" value={edit[0]} />
                <button onClick={handleConfirm} >confirm</button>
              </section>
            </div>

            <div className={[e.done ? "done" : null, "item"].join(" ")}>
              <i
                className={[e.done ? "fas" : "far", "fa-check-circle"].join(
                  " "
                )}
                style={{ fontSize: "25px" }}
                onClick={(evet) => {
                  handleCheck(e, i, evet);
                }}
              ><FontAwesomeIcon icon={faCheckCircle} color={e.done ? "green" : "grey"}/>
              </i>
              <input hidden type="checkbox" />
              <li style={{ paddingRight: "2em" }}>{e.item}</li>
              <i
                className="fas fa-trash"
                style={{ fontSize: "20px" }}
                onClick={() => {
                  handleRemove(e.id);
                }}
              ></i>
              <i
                className="fas fa-edit"
                style={{ fontSize: "20px" }}
                onClick={() => {
                  handleEdit(e, e.id);
                }}
              ></i>
              
            </div>
          </>
        );
      })}
    </div>
  );
}
