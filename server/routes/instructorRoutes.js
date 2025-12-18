import express from 'express'
import {
  addCourse,
  instructorDashboardData,
  getInstructorCourses,
  getEnrolledStudentsData,
  updateRoleToInstructor,
  getInstructorCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/instructorController.js';
import upload from '../configs/multer.js';
import { protectInstructor } from '../middlewares/authMiddleware.js';


const instructorRouter = express.Router()

// Add Instructor Role 
instructorRouter.get('/update-role', updateRoleToInstructor)

// Add Courses 
instructorRouter.post('/add-course', upload.single('image'), protectInstructor, addCourse)

// Get Instructor Courses 
instructorRouter.get('/courses', protectInstructor, getInstructorCourses)

// Get single course (for edit)
instructorRouter.get('/course/:id', protectInstructor, getInstructorCourseById)

// Update course (thumbnail optional)
instructorRouter.put('/course/:id', upload.single('image'), protectInstructor, updateCourse)

// Delete course (blocked if purchased/enrolled)
instructorRouter.delete('/course/:id', protectInstructor, deleteCourse)

// Get Instructor Dashboard Data
instructorRouter.get('/dashboard', protectInstructor, instructorDashboardData)

// Get Instructor Students Data
instructorRouter.get('/enrolled-students', protectInstructor, getEnrolledStudentsData)


export default instructorRouter;