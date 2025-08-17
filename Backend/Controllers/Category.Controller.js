import { Category } from "../Models/Category.Model.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a name",
      });
    }

    const newCategory = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Failed to create Category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};

const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
          select: "firstName lastName",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      message: "Category page details fetched successfully",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category page details",
    });
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export { createCategory, getAllCategories, categoryPageDetails };
