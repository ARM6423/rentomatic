import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const DescriptionBox = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    const files = event.target.files;
    const attachmentsArray = Array.from(files);
    setAttachments(attachmentsArray);
  };

  const handleSubmit = () => {
    onSubmit({ description, category, attachments });
    setDescription("");
    setCategory("");
    setAttachments([]);
  };

  return (
    <div className="description-box">
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
      />
      <TextField
        label="Category"
        value={category}
        onChange={handleCategoryChange}
      />
      <input type="file" multiple onChange={handleAttachmentChange} />
      <Button variant="contained" onClick={handleSubmit}>
        Create Ticket/Invoice
      </Button>
    </div>
  );
};

// basic format for description box, needs to be edited later
// TODO: CSS styling, sizing, addition of more functionality

export default DescriptionBox;
