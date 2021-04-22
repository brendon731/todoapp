import React, { useCallback, useState, useEffect } from "react";
import "./index.css";
import "./modal.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTrash,
  faEdit
} from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [view, setView] = useState([]);
  const [select, setSelect] = useState("all");
  const [open, isOpen] = useState(false);
  const [edit, setEdit] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true)
  const [isDark, setIsDark] = useState(false)

  
  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      setTodoList([
        {
          item: todo,
          id: new Date().getTime(),
          done: false,
          remove:false
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
    (i) => {
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

  useEffect(()=>{
    setIsDark(JSON.parse(localStorage.getItem("dark-mode")))
  },[])

  useEffect(()=>{
    localStorage.setItem("dark-mode", JSON.stringify(isDark));
  },[isDark])
  
  const handleRemove = useCallback(
    () => {
      if(window.confirm("Are you sure you want to remove these itens?")){

        setTodoList(
          todoList.filter((e) => {
             return e.remove === false;
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

  const handleSelectRemove = useCallback(
    (i) => {
      const newtodo = [...todoList];
      newtodo[i].remove = !newtodo[i].remove;
      setTodoList(newtodo);
    },
    [todoList]
  );

  useEffect(()=>{
    if(todoList.length === 0){
      setIsDisabled(true)
    }else{
      for(let a=0; a<todoList.length; a++){
        if(todoList[a].remove === true){
          setIsDisabled(false)
          break
        }else{
          setIsDisabled(true)
        }
      }
    }
  },[todoList])

  const handleClear = useCallback(()=>{
    if(window.confirm("Are you sure you want to remove everything?")){
      setTodoList([])
    }
  },[])

  return (
    <div className={isDark?"dark":null}>
    <div className="main" >
      
      <label>
        <input hidden type="checkbox" id="checkbox" onChange={()=>{setIsDark(!isDark)}} />
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
      <div className="container-remove">

        <select
          onChange={(evt) => {
            setSelect(evt.target.value);
          }}
          >
          <option>All</option>
          <option>Done</option>
          <option>To Do</option>
        </select>
          <button 
          style={{color:todoList.length===0?"grey":null}}
          className="clear" 
          disabled={todoList.length===0}
          onClick={()=>{handleClear()}}>
            Clear
          </button>

          <button 
          style={{color:isDisabled?"grey":null}}
          className="remove-button" 
          disabled={isDisabled} onClick={()=>{handleRemove()}}>
            Remove Selected
          </button>
          </div>
      {view.map((e, i) => {
        return (
          <div key={e.item+i}>
            <div className={open ? "open" : "hidden"}>
              <section className="section">
                <input onChange={handleEditing} type="text" value={edit[0]} className="modal-input"/>
                <button onClick={handleConfirm} >confirm</button>
              </section>
            </div>

            <div className={[e.done ? "done" : null, "item"].join(" ")}>
              <i
                className="circle"
                style={{ fontSize: "25px"}}
                onClick={() => {
                  handleCheck(i);
                }}
              ><FontAwesomeIcon icon={faCheckCircle} color ={e.done ? "green" : "grey"}/>

              </i>
              <input hidden type="checkbox" />
              <li style={{ paddingRight: "2em" }}>{e.item}</li>
              <i
                className="trash"
                style={{ fontSize: "20px" }}
                onClick={() => {
                  handleSelectRemove(i);
                }}
              ><FontAwesomeIcon icon={faTrash} color={e.remove?"red":"grey"}/>
              
              </i>
              <i
                className="edit"
                style={{ fontSize: "20px" }}
                onClick={() => {
                  handleEdit(e, e.id);
                }}
                ><FontAwesomeIcon icon={faEdit}/>
              
              </i>
              
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
