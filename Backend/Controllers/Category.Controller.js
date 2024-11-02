import { Category } from "../Models/Category.Model";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Please provide name",
      });
    }
    const Category = await Category.create({
      name,
      description,
    });

    console.log("Category", Category);

    res.status(201).json({
      status: true,
      data: Category,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: false,
      message: "Failed to create Category",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const Categories = await Category.find(
      {},
      {
        name: true,
        discription: true,
      }
    );

    res.status(200).json({
      status: true,
      data: Categories,
      message: "Categorys retrieved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: false,
      message: "Failed to get Categorys",
    });
  }
};

const categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    if (!selectedCategory) {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }

    const diffrentCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses")
      .exec();

    //get top 10 selling courses hW

    return res.status(200).json({
      status: true,
      data: {
        selectedCategory,
        diffrentCategories,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Failed to get category details",
    })
  }
};

export { createCategory, getAllCategories };
