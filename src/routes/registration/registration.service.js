const users = [] 
const confirmation_codes = []

let seq_user = 1;
let seq_code = 1;

const registration_phone = (cred_phone)=>{    
    let phone_number = Buffer.from(cred_phone, "base64").toString();
    phone_number = parseInt(phone_number);
    
    if(!phone_number)
        throw Error("Неверно указан номер телефона");

    const user = users.find(u => u.phone === phone_number);

    if(user)
        throw Error("Пользователь с таким номером телефона уже существует!");

    seq_user = seq_user + 1;

    const new_user = 
    {
        user_id: seq_user,
        phone: phone_number,
        login: null,
        password: null,
        create_on_tz: new Date().toISOString(),
        confirm: false
    }

    users.push(new_user);   

    const confirmation_code = Math.floor(Math.random() * (999999 - 0) + 0);   
    seq_code = seq_code + 1;
    confirmation_codes.push(
        {
            code_id: seq_code,
            user_id: seq_user,
            code: confirmation_code,
            create_on_tz: new Date().toISOString()
        });

    return seq_code;
}

const confitmation_code = (confirm_code_id) =>{
    let confirm_cred = Buffer.from(confirm_code_id, "base64").toString();

    console.log(confirm_cred);

    if(!confirm_cred)
        throw Error("Не указан код подтверждения");

    confirm_cred = confirm_cred.split(":");
    const res_confirm = confirmation_codes.find(c => c.code_id === parseInt(confirm_cred[0]) && c.code === parseInt(confirm_cred[1]));
    
    //сервис получения токена
    let token;
    
    if(res_confirm)
        token = "token";
    
    return token;
}

export {registration_phone, confitmation_code}