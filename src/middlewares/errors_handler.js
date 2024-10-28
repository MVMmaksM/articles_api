async function error_handler(err, req, res, next) {
    console.log(`\n ${err.stack} \n`);    
    res.status(err.status_code || 500).json({error_code: err.error_code || -1, error_msg: err.message});
}

export default error_handler;