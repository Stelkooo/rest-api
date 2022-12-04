'use strict';

const express = require('express');
const { User, Course } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');

const router = express.Router();

router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await User.findAll();

    res.status(200).json({
      message: users,
    });
  }),
);

router.post(
  '/users',
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).json({
        message: 'User created successfully',
      });
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
    const courses = await Course.findAll();

    res.status(200).json({
      message: courses,
    });
  }),
);

// Returns a specific course
router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    res.status(200).json({
      message: course,
    });
  }),
);

// Creates a new course
router.post(
  '/courses',
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.status(201).json({
        message: 'Course created successfully',
      });
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

module.exports = router;
