import Course from "../models/course.js";
import cloudinary from "../config/cloudinary.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// export const createCourse = async (req, res) => {
//   try {
//     const { title, description, price, category, instructor, categoryId } =
//       req.body;
//     let imageUrl;
//     let pdfUrl;

//     if (req.file) {
//       const b64 = Buffer.from(req.file.buffer).toString("base64");
//       const dataURI = `data:${req.file.mimetype};base64,${b64}`;
//       const result = await cloudinary.uploader.upload(dataURI);
//       imageUrl = result.secure_url;
//     }

//     const course = new Course({
//       title,
//       description,
//       image: imageUrl,
//       price,
//       category,
//       instructor,
//       categoryId,
//     });

//     await course.save();

//     res.status(201).json({
//       message: "Course added successfully",
//       course,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


export const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, instructor, categoryId } =
      req.body;

    let imageUrl;
    let pdfUrl;

    // Upload Image
    if (req.files?.image) {
      const b64 = Buffer.from(req.files.image[0].buffer).toString("base64");
      const dataURI = `data:${req.files.image[0].mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      imageUrl = result.secure_url;
    }

    // Upload PDF
    if (req.files?.pdf) {
      const b64 = Buffer.from(req.files.pdf[0].buffer).toString("base64");
      const dataURI = `data:${req.files.pdf[0].mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "raw", // Needed for non-image files
      });
      pdfUrl = result.secure_url;
    }

    const course = new Course({
      title,
      description,
      image: imageUrl,
      pdf: pdfUrl, // Add PDF field in your schema
      price,
      category,
      instructor,
      categoryId,
    });

    await course.save();

    res.status(201).json({
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    console.log("check")
    const { title, description, price, category, instructor, categoryId } =
      req.body;
    let imageUrl;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI);
      imageUrl = result.secure_url;
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    if (imageUrl) course.image = imageUrl;
    course.price = price || course.price;
    course.category = category || course.category;
    course.instructor = instructor || course.instructor;
    course.categoryId = categoryId || course.categoryId;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
