async function error_handler(err, req, res, next) {
    console.log(`\nERROR:${JSON.stringify(err)} \n`);
    console.log(`ERROR:${err.stack} \n`);
    return res.status(err.status_code || 500).json(err);         
}

export default error_handler;