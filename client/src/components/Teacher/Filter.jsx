import React, { useState } from "react";

const FilterComponent = ({ data, columns, onFilter }) => {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  const handleFilter = () => {
    if (!selectedColumn || !operator || value === "") return;

    let filteredData = [];
    switch (operator) {
      case "equals":
        filteredData = data.filter((row) => row[selectedColumn] === value);
        break;
      case "contains":
        filteredData = data.filter((row) =>
          row[selectedColumn].includes(value),
        );
        break;
      // Add more cases for different operators
      default:
        filteredData = [...data];
    }

    onFilter(filteredData);
  };

  return (
    <div>
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
      >
        {columns.map((col) => (
          <option key={col.field} value={col.field}>
            {col.headerName}
          </option>
        ))}
      </select>
      <select value={operator} onChange={(e) => setOperator(e.target.value)}>
        <option value="equals">Equals</option>
        <option value="contains">Contains</option>
        {/* Add more options for different operators */}
      </select>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
    </div>
  );
};

export default FilterComponent;
