const multer = require("multer");
const sharp = require("sharp");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

//? filtering the uploads (accepting images only)

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.array("images", 4);

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];
  // processing the images
  await Promise.all(
    req.files.map(async (file, index) => {
      const filename = `product-${req.user._id}-${Date.now()}-${
        index + 1
      }.jpeg`;

      await sharp(file.buffer)
        // .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const seller = req.user._id;
  const { name, description, price, category, images } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    images,
    seller,
  });
  res.status(201).json({
    status: "success",
    product,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).json({
    status: "success",
    product,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const { seller } = product;
  console.log(seller);
  // again one of the IDs is a string so
  // I have to convert both of them to string
  // to test the equality
  if (seller.toString() === req.user._id.toString()) {
    await Product.deleteOne({ seller });
    res.status(200).json({
      status: "success",
      data: null,
    });
  } else {
    return next(
      new AppError("You dont have the permission to perform this action", 403)
    );
  }
});

exports.getProducts = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "field"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // specific search
  let query = Product.find(queryObj);

  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }
    else {
      query = query.sort("-createdAt");
    }

  // pagination
  const page = req.query.page * 1 || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // query execution
  const products = await query.populate("seller", "name photo");

  res.status(200).json({
    status: "success",
    num: products.length,
    products,
  });
});
