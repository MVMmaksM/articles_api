import md5 from "md5";

const access_user = (cred_phone)=>{
    const phone_number = parseInt(Buffer.from(cred_phone, "base64").toString());

    if(!phone_number)
        throw Error("Некорректный номер телефона");

    const user = global.users.find(u => u.phone === phone_number);

    if(!user)
        throw Error("Пользователь с указанным номером телефона не существует");

    return user.user_id;
}

const create_user_token = (user_id) =>{
    const token_hash = md5(user_id.toString() + Date.now().toString());
    let buff = new Buffer(token_hash);
    const token = buff.toString('base64');

    global.seq_user_tokens = seq_user_tokens + 1;
    global.user_tokens.push(
        {
            user_tokens_id: seq_user_tokens, 
            user_id: user_id,
            create_on_tz: new Date().toISOString(),
            token: token_hash
        });

    return token;
}

const create_confirm_code = (user_id)=>{
    const confirmation_code = Math.floor(Math.random() * (999999 - 0) + 0);   
    global.seq_code = seq_code + 1;
    global.confirmation_codes.push(
        {
            code_id: seq_code,
            user_id: user_id,
            code: confirmation_code,
            create_on_tz: new Date().toISOString()
        });

    console.log(global.confirmation_codes);
    return seq_code;
}

export {access_user, create_user_token, create_confirm_code}