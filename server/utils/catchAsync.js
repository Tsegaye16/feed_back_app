export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.error("An error occurred:", err); // Log errors for debugging
      res.status(400).json({ message: err });
    });
  };
};
