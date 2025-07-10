const Todo = require("../models/TodoModel");
const User = require("../models/userModel");

exports.createTodo = async (req, res) => {
  try {
    const { title, description, tags, priority, mentions , visibility } = req.body;
    const mentionIds = await User.find({ username: { $in: mentions } }).select("_id");

    const todo = await Todo.create({
      title,
      description,
      tags,
      priority,
      mentions: mentionIds,
      user: req.user.id,
      visibility: visibility || "private"
    });

    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getPublicTodos = async (req, res) => {
  try {
    const publicTodos=await Todo.find({visibility: "public"}).populate("mentions", "username");
    res.status(200).json(publicTodos);
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
}


exports.getTodos = async (req, res) => {
  const { page = 1, limit = 10, priority, tag, mention, sortBy = "createdAt" } = req.query;

  const filter = { user: req.user.id };

  if (priority) filter.priority = priority;
  if (tag) filter.tags = tag;
  if (mention) {
    const user = await User.findOne({ username: mention });
    if (user) filter.mentions = user._id;
  }

  const todos = await Todo.find(filter)
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate("mentions", "username");

  res.json(todos);
};

exports.updateTodo = async (req, res) => {
  try {
    let updateData = req.body;

   
    if (updateData.mentions && Array.isArray(updateData.mentions)) {
      const mentionUsers = await User.find({ username: { $in: updateData.mentions } }).select("_id");
      updateData.mentions = mentionUsers.map(user => user._id);
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  const result = await Todo.deleteOne({ _id: req.params.id, user: req.user.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: "Todo not found" });
  res.json({ message: "Deleted" });
};
