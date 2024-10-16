const users = [] 
const confirmation_codes = []

let seq_user = 2;

const registration_phone = (cred_phone)=>{    
    const phone_number = Buffer.from(cred_phone, "base64").toString();

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
    confirmation_codes.push(
        {
            code_id: 1,
            user_id: seq_user,
            code: confirmation_code
        });

    return true;
}

export {registration_phone}