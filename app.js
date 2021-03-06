const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitizer = require("express-mongo-sanitize");
const limit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");
const path = require("path");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

const app = express();
app.use(express.json());
app.use(cors());

// serving static assets
app.use("/public", express.static(path.join(__dirname, "public")));

// security middlewars
app.use(helmet());
app.use(xss());
app.use(mongoSanitizer());
app.use(
  limit({
    max: 1000,
  })
);
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

app.use(globalErrorHandler);

module.exports = app;
