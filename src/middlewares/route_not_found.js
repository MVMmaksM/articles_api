const error_route_not_found = {
    name: "Error route not found",
    status_code: 404,
    error: "Bad Request"
}

async function route_not_found (req, res) {
    res.status(404).json({
        name: error_route_not_found.name,
        status_code: error_route_not_found.status_code,
        error: error_route_not_found.error,
        details: `Указанный роут: ${req?.originalUrl} не найден`
    });
}

export default route_not_found;