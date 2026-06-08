const express = require('express');
const { body, param } = require('express-validator');
const {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  toggleTaskStatus,
  updateTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('status').optional().isIn(['Pending', 'Completed']).withMessage('Invalid status'),
  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        throw new Error('Due date cannot be in the past');
      }

      return true;
    })
];
const idValidation = [param('id').isMongoId().withMessage('Invalid task id')];

router.use(protect);

router.route('/').get(getTasks).post(taskValidation, validateRequest, createTask);

router
  .route('/:id')
  .get(idValidation, validateRequest, getTask)
  .put(idValidation, taskValidation, validateRequest, updateTask)
  .delete(idValidation, validateRequest, deleteTask);

router.patch('/:id/status', idValidation, validateRequest, toggleTaskStatus);

module.exports = router;
