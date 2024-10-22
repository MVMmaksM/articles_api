const authorize = (req, res, next)=>{   
    const token = req.headers["authorization"] ? Buffer.from(req.headers["authorization"], "base64").toString() : undefined;

    if(!token)
        res.status(401).send({errorCode: -1, errorMsg: "Не авторизован"});

    const user_id = global.user_tokens.find(ut => ut.token === token)?.user_id;

    if(!user_id)
        res.status(401).json({errorCode: -1, errorMsg: "Не авторизован"});

    next();
}

export {authorize}