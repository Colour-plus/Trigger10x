const errorHandler = (err, req, res, next) => {
    console.error("TRIGGER10X BACKEND ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong. Please try again later."
    });
};

module.exports = errorHandler;
module.exports.errorHandler = errorHandler;