'use strict';

const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();

router.get(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  }),
);

router.post(
  '/users',
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }),
);

// Returns a list of all the courses
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'emailAddress'],
        },
      ],
      attributes: ['id', 'title', 'description', 'materialsNeeded', 'userId'],
    });

    res.status(200).json({
      message: courses,
    });
  }),
);

// Returns a specific course
router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'emailAddress'],
        },
      ],
      attributes: ['id', 'title', 'description', 'materialsNeeded', 'userId'],
    });

    res.status(200).json({
      message: course,
    });
  }),
);

// Creates a new course
router.post(
  '/courses',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).location(`courses/${course.id}`).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }),
);

// Updates an existing course
router.put(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const currentUserId = req.currentUser.id;
    try {
      const course = await Course.findByPk(req.params.id);
      if (currentUserId === course.userId) {
        await course.update(req.body);
        res.status(204).json();
      } else {
        res.status(403).json();
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }),
);

// Delete an existing course

router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const currentUserId = req.currentUser.id;
    try {
      const course = await Course.findByPk(req.params.id);
      if (currentUserId === course.userId) {
        await course.destroy();
        res.status(204).json();
      } else {
        res.status(403).json();
      }
    } catch (error) {
      throw error;
    }
  }),
);

module.exports = router;
