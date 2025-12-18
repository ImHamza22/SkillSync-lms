import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { CourseProgress } from '../models/CourseProgress.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

// update role to instructor
export const updateRoleToInstructor = async (req, res) => {

    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'instructor',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const instructorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)

        parsedCourseData.instructor = instructorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Instructor Courses
export const getInstructorCourses = async (req, res) => {
    try {

        const instructor = req.auth.userId

        const courses = await Course.find({ instructor })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Instructor Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const instructorDashboardData = async (req, res) => {
    try {
        const instructor = req.auth.userId;

        const courses = await Course.find({ instructor });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const instructor = req.auth.userId;

        // Fetch all courses created by the instructor
        const courses = await Course.find({ instructor });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get a single course by id (for instructor edit)
export const getInstructorCourseById = async (req, res) => {
    try {
        const instructor = req.auth.userId
        const { id } = req.params

        const course = await Course.findById(id)

        if (!course) {
            return res.json({ success: false, message: 'Course Not Found' })
        }

        if (course.instructor !== instructor) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        return res.json({ success: true, course })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Update course (thumbnail optional)
export const updateCourse = async (req, res) => {
    try {
        const instructor = req.auth.userId
        const { id } = req.params

        const course = await Course.findById(id)

        if (!course) {
            return res.json({ success: false, message: 'Course Not Found' })
        }

        if (course.instructor !== instructor) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        // Supports both multipart (courseData string) and JSON body.
        const parsedCourseData = req.body.courseData ? JSON.parse(req.body.courseData) : req.body

        if (typeof parsedCourseData.courseTitle === 'string') course.courseTitle = parsedCourseData.courseTitle

        // courseDescription is required: if present but empty, return a clear error.
        if (parsedCourseData.courseDescription !== undefined) {
            if (typeof parsedCourseData.courseDescription !== 'string' || parsedCourseData.courseDescription.trim().length === 0) {
                return res.json({ success: false, message: 'Course description is required' })
            }
            course.courseDescription = parsedCourseData.courseDescription
        }

        // Numbers may arrive as strings
        if (parsedCourseData.coursePrice !== undefined) {
            const p = Number(parsedCourseData.coursePrice)
            if (!Number.isNaN(p)) course.coursePrice = p
        }

        if (parsedCourseData.discount !== undefined) {
            const d = Number(parsedCourseData.discount)
            if (!Number.isNaN(d)) course.discount = d
        }

        if (Array.isArray(parsedCourseData.courseContent)) {
            course.courseContent = parsedCourseData.courseContent
        }

        // Optional thumbnail update
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path)
            course.courseThumbnail = imageUpload.secure_url
        }

        await course.save()

        return res.json({ success: true, message: 'Course Updated' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Delete course (BLOCKED if purchased/enrolled)
export const deleteCourse = async (req, res) => {
    try {
        const instructor = req.auth.userId
        const { id } = req.params

        const course = await Course.findById(id)

        if (!course) {
            return res.json({ success: false, message: 'Course Not Found' })
        }

        if (course.instructor !== instructor) {
            return res.json({ success: false, message: 'Unauthorized Access' })
        }

        // Block deletion if any students are enrolled
        if (Array.isArray(course.enrolledStudents) && course.enrolledStudents.length > 0) {
            return res.json({
                success: false,
                message: 'This course has enrolled students and cannot be deleted. Please unpublish/archive it instead.'
            })
        }

        // Block deletion if any purchase history exists (completed/pending/failed)
        const hasPurchases = await Purchase.exists({ courseId: course._id })
        if (hasPurchases) {
            return res.json({
                success: false,
                message: 'This course has purchase history and cannot be deleted. Please unpublish/archive it instead.'
            })
        }

        // Cleanup: remove references (defensive)
        await User.updateMany(
            { enrolledCourses: course._id },
            { $pull: { enrolledCourses: course._id } }
        )

        await CourseProgress.deleteMany({ courseId: course._id.toString() })

        await Course.findByIdAndDelete(course._id)

        return res.json({ success: true, message: 'Course Deleted' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
