require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getAllNote, getNote, addNote, updateNote, deleteNote } = require("./controllers/supabase");
const { isAdmin } = require("./middleware/isAdmin");
const helmet = require("helmet");
const route = "/api/v1/";
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.post(route, async (req, res) => {
  const data = await addNote(req.body);
  res.send(data);
});

app.patch(`${route}:id`, isAdmin, async (req, res) => {
  const data = await updateNote(req.body, req.params.id);
  res.json(data);
});

app.delete(`${route}:id`, isAdmin, async (req, res) => {
  const data = await deleteNote(req.params.id);
  res.json(data);
});

app.get(`${route}:id`, async (req, res) => {
  const data = await getNote(req.params.id);
  res.json(data);
});

app.get(route, async (req, res) => {
  const data = await getAllNote();
  res.json(data);
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}${route}`);
});
