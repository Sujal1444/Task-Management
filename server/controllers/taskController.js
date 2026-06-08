const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

const getTaskForUser = async (taskId, userId) => {
  const task = await Task.findOne({ _id: taskId, userId });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  return task;
};

const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const sortOrder = req.query.sort === 'oldest' ? 1 : -1;
  const status = req.query.status;
  const search = req.query.search?.trim();

  const query = { userId: req.user._id };

  if (['Pending', 'Completed'].includes(status)) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const [tasks, total, stats] = await Promise.all([
    Task.find(query).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
    Task.countDocuments(query),
    Task.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
  ]);

  const counts = stats.reduce(
    (acc, item) => ({ ...acc, [item._id.toLowerCase()]: item.count }),
    { pending: 0, completed: 0 }
  );

  res.json({
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1
    },
    stats: {
      total: counts.pending + counts.completed,
      pending: counts.pending,
      completed: counts.completed
    }
  });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.id, req.user._id);
  res.json(task);
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'Pending',
    dueDate: req.body.dueDate,
    userId: req.user._id
  });

  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.id, req.user._id);

  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.status = req.body.status ?? task.status;
  task.dueDate = req.body.dueDate ?? task.dueDate;

  const updatedTask = await task.save();
  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.id, req.user._id);
  await task.deleteOne();
  res.json({ id: req.params.id, message: 'Task deleted' });
});

const toggleTaskStatus = asyncHandler(async (req, res) => {
  const task = await getTaskForUser(req.params.id, req.user._id);
  task.status = task.status === 'Completed' ? 'Pending' : 'Completed';

  const updatedTask = await task.save();
  res.json(updatedTask);
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
