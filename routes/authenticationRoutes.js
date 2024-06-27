const mongoose = require('mongoose'); // mongoose를 불러옵니다.
const Account = mongoose.model('accounts'); // 'accounts' 모델을 불러옵니다.

const argon2 = require('argon2');
const crypto = require("crypto");

module.exports = app => {
    // 라우터 설정
    app.post('/account/login', async (req, res) => {

        var response = {};

        // req에서 username과 password를 가져옵니다.
        const { rUsername, rPassword } = req.body;

        // username이나 password가 없으면 "Invalid credentials" 메시지를 반환합니다.
        if (rUsername == null || rPassword == null) {
            response.code = 1;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }

        // 데이터베이스에서 username이 rUsername인 계정을 찾습니다.
        var userAccount = await Account.findOne({ username: rUsername });
        //계정이 있으면
        if (userAccount != null) {
            argon2.verify(userAccount.password, rPassword).then(async (success) => {
                if (success) {
                    console.log("Sucess Login!");
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();

                    response.code = 0;
                    response.msg = "Account found";
                    response.data = userAccount;
                    res.send(response);

                    return;
                }
                else {
                    // 비밀번호가 일치하지 않으면 "Invalid credentials" 메시지를 반환합니다.
                    console.log("Login Failed!");
                    response.code = 1;
                    response.msg = "Invalid credentials";
                    res.send(response);
                    return;
                }
            });
        }
        else {
            // 비밀번호가 일치하지 않으면 "Invalid credentials" 메시지를 반환합니다.
            console.log("Login Failed!");
            response.code = 1;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }
    });


    // 라우터 설정
    app.post('/account/create', async (req, res) => {

        var response = {};

        // req에서 username과 password를 가져옵니다.
        const { rUsername, rPassword } = req.body;

        // username이나 password가 없으면 "Invalid credentials" 메시지를 반환합니다.
        if (rUsername == null || rPassword == null) {
            response.code = 1;
            response.msg = "Invalid credentials";
            res.send(response);
            return;
        }

        // 데이터베이스에서 username이 rUsername인 계정을 찾습니다.
        var userAccount = await Account.findOne({ username: rUsername });

        // 계정이 존재하지 않으면 새 계정을 만듭니다.
        if (userAccount == null) {
            // 새로운 계정을 생성합니다.
            console.log("Create new account...");

            try {
                // 비동기 함수 내에서 사용되므로 await 사용
                const salt = await new Promise((resolve, reject) => {
                    // crypto 모듈의 randomBytes 함수를 사용하여 32바이트의 랜덤 바이트 배열을 생성
                    crypto.randomBytes(32, (err, buffer) => {
                        if (err) reject(err); // 에러가 발생하면 reject로 에러를 반환
                        resolve(buffer); // 성공하면 resolve로 생성된 바이트 배열(buffer)을 반환
                    });
                });

                // argon2 모듈을 사용하여 입력된 비밀번호를 해시화, 생성된 salt를 사용하여 비밀번호를 해시
                const hashedPassword = await argon2.hash(rPassword, { salt });

                // 새로운 계정 객체를 생성, MongoDB 컬렉션의 도큐먼트로 변환
                var newAccount = new Account({
                    username: rUsername, // 입력된 사용자 이름을 설정
                    password: hashedPassword, // 해시된 비밀번호를 설정
                    salt: salt, // 생성된 salt를 설정
                    lastAuthentication: Date.now() // 현재 시간을 마지막 인증 시간으로 설정
                });

                // 새로운 계정을 MongoDB 데이터베이스에 저장
                await newAccount.save();

                response.code = 0;
                response.msg = "Account found";
                response.data = userAccount;
                res.send(response);

                return;
            } catch (err) {
                console.log("ERROR Creating account and hashedPassword");
            }

        } else {
            response.code = 2;
            response.msg = "Username is already taken";
            res.send(response);
        }

        return;
    });
}
