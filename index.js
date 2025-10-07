import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts })
});

app.post("/", (req, res) => {
  const title = (req.body["post-title"] || "").trim();
  const body = (req.body["post-text"] || "").trim();
  if (!title || !body) {
    return res.status(400).render("index.ejs", { posts, error: "Both fields required." });
  }
  const post = {id: title, title, body};
  posts.unshift(post);
  return res.redirect("/");
});

app.post("/:id", (req, res) => {
  const i = posts.findIndex(p => p.id.toString() === req.params.id);
  if (i !== -1) posts.splice(i, 1);
  res.redirect("/");
});

app.post("/:id/update", (req, res) => {
  const id = req.params.id;
  const title = (req.body.title || "").trim();
  const body  = (req.body.body  || "").trim();

  const i = posts.findIndex(p => p.id.toString() === id);
  if (i === -1) return res.status(404).send("Post not found");

  if (!title || !body) {
    return res.status(400).redirect("/");
  }
  posts[i] = { ...posts[i], title, body };

  return res.redirect("/");
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});