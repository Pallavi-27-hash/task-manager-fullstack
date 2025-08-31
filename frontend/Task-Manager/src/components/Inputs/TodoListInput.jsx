import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [task, setTask] = useState("");
  const [assignee, setAssignee] = useState("");

  const handleAddOption = () => {
    if (task.trim() !== "") {
      // ✅ Allow task with or without assignee
      const newTask = {
        text: task.trim(),
        assignedTo: assignee.trim() || null, // optional
      };

      setTodoList([...(todoList || []), newTask]);
      setTask("");
      setAssignee("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = (todoList || []).filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div>
      {(todoList || []).map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <p className="text-xs text-black">
            <span className="text-xs text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item.text}
            {item.assignedTo && (
              <span className="ml-2 text-blue-500 text-[11px]">
                (Assigned to: {item.assignedTo})
              </span>
            )}
          </p>
          <button
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex flex-col gap-3 mt-4">
        {/* Task Input */}
        <input
          type="text"
          placeholder="Enter Task"
          value={task}
          onChange={({ target }) => setTask(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        {/* Assign To Input (optional) */}
        <input
          type="text"
          placeholder="Assign To (optional)"
          value={assignee}
          onChange={({ target }) => setAssignee(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap flex items-center gap-2" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;

