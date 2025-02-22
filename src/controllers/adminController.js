import User from "../models/user.js";
import Course from "../models/course.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTotalEnrollments = async (req, res) => {
  try {
    const courses = await Course.find();
    const users = await User.find().populate("enrolledCourses");

    let totalEnrollments = 0;
    const enrolledCourses = courses.map((course) => {
      const enrolledUsers = users
        .filter((user) =>
          user.enrolledCourses.some(
            (c) => c._id.toString() === course._id.toString()
          )
        )
        .map((user) => user._id);

      totalEnrollments += enrolledUsers.length;

      return {
        courseId: course._id,
        title: course.title,
        enrolledUsers,
      };
    });

    res.json({
      totalEnrollments,
      enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
