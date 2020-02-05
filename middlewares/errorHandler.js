const errorHandler = (error, req, res, next) => {
  if (error.statusCode && error.message) {
    return res.status(error.statusCode).send(error.message);
  }
  console.log(error);
  res.status(500).send("Server Error");
};

module.exports = errorHandler;
