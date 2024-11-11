async function error_handler(err, req, res, next) {
    console.log(`\nERROR:${err.stack} \n`);

    return res.status(err.status_code || 500).json(
        {
            name: err.name || "Internal Server Error",
            status_code: err.status_code || 500,
            error: err.error || "Internal Server Error",
            details: err.details || err.message
        });     
}

export default error_handler;