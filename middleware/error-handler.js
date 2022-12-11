// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCodes: err.statusCodes || StatusCodes.INTERNAL_SERVER_ERRORm,
    message: err.message || "something went wrong, please try again later!",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCodes).json({ msg: err.message });
  // }

  if (err.name == "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCodes = 400;
  }

  if (err.name == "CastError") {
    customError.message = `No job with id : ${err.value}`;
    customError.statusCodes = 400;
  }

  if (err.code && err.code == "11000") {
    customError.message = `Dublicate value entered for email  field, please choose another value!`;
    customError.statusCodes = 404;
  }

  return res.status(customError.statusCodes).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
