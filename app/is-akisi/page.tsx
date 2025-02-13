"use client";

import { useState } from "react";

const IsAkisi = () => {
  const [workflows, setWorkflows] = useState<string[]>([]);
  const [newWorkflow, setNewWorkflow] = useState<string>("");

  const handleAddWorkflow = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWorkflows([...workflows, newWorkflow]);
    setNewWorkflow("");
  };

  const handleWorkflowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorkflow(e.target.value);
  };

  return (
    <div>
      <h1>Is Akisi</h1>
      <form onSubmit={handleAddWorkflow}>
        <input
          type="text"
          value={newWorkflow}
          onChange={handleWorkflowChange}
          placeholder="Add new workflow"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {workflows.map((workflow, index) => (
          <li key={index}>{workflow}</li>
        ))}
      </ul>
    </div>
  );
};

export default IsAkisi;
