import { RatingAndReview } from "../Models/RatingAndReview.Model.js";
import { Course } from "../Models/Course.Model.js";
import mongoose from "mongoose";

const createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: {
        $elemMatch: {
          $eq: userId,
        },
      },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    const AlreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });

    if (AlreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingAndReview._id,
        },
      },
      { new: true }
    );
    console.log("updatedCourse", updatedCourse);

    return res.status(200).json({
      success: true,
      message: "Review added successfully",
      ratingAndReview: ratingAndReview,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to create rating",
    });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    } else {
      return res.status(200).json({
        success: false,
        averageRating: 0,
        message: "No rating found, Average Rating is 0",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to get average rating",
    });
  }
};

const getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    if (!allReviews) {
      return res.status(404).json({
        success: false,
        message: "No ratings found",
      });
    }

    return res.status(200).json({
      success: true,
      data: allReviews,
      message: "All reviews fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to get all rating",
    });
  }
};

export { createRating, getAverageRating, getAllRating };
