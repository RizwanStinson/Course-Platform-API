import User from "../models/user.js";
import Course from "../models/course.js";
import cloudinary from "../config/cloudinary.js";


export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: "abc@admin.com" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses")
      .populate("favorites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    let imageUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      imageUrl = result.secure_url;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (imageUrl) user.image = imageUrl;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        enrolledCourses: user.enrolledCourses,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addToFavorites = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.favorites.includes(courseId)) {
      user.favorites.push(courseId);
      await user.save();
    }

    res.json({
      message: "Course added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.courseId
    );
    await user.save();

    res.json({
      message: "Course removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("enrolledCourses");
    res.json({ enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    res.json({
      message: "Successfully enrolled in the course",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getCourseEnrollmentCounts = async (req, res) => {
  try {
    const courses = await Course.find({}, "_id title"); // Fetch all courses with only ID and title
    const courseEnrollmentCounts = [];

    for (const course of courses) {
      const enrollmentCount = await User.countDocuments({
        enrolledCourses: course._id,
      });
      courseEnrollmentCounts.push({
        courseId: course._id,
        title: course.title,
        enrollmentCount,
      });
    }

    res.status(200).json(courseEnrollmentCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};