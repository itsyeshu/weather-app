const DEFAULT = require("./constants");

const errorParser = function(err, req, res, next) {
    // console.log("Error Parser : ", err);
    if(err || res.locals.err){
        console.log("Error while sending response : ", err || res.locals.err);
        const error = err || res.locals.err;
        const errorObj = {
            "ref_id" : req.id,
            "status": error.cause.statusCode || 500,
            "message": error.message || "Internal Server Error",
            "description": error.cause.message || "Unknonwn Error occured",
            "stack": error.stack || "",
        }
        res.status(errorObj.status).render(`${ DEFAULT.VIEW_DIR }/pages/error_page`, errorObj);
    }
    next(err);
}


module.exports = errorParser;