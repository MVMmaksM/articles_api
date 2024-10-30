import ERRORS from "../errors/error_codes/error_codes_not_found.js";

async function route_not_found (req, res) {
    res.status(404).json({error_code: ERRORS.ROUTE_NOT_FOUND.error_code, error_msg: ERRORS.ROUTE_NOT_FOUND.error_message});
}

export default route_not_found;