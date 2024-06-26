const mongoose = require('mongoose'); // mongoose를 불러옵니다.
const Account = mongoose.model('accounts'); // 'accounts' 모델을 불러옵니다.

module.exports = app => {
    // 라우터 설정
    app.post('/account/login', async(req, res) => {
        console.log(req.body);
        // req에서 username과 password를 가져옵니다.
        const {rUsername, rPassword} = req.body;
        
        // username이나 password가 없으면 "Invalid credentials" 메시지를 반환합니다.
        if(rUsername == null || rPassword == null) {
            res.send("Invalid credentials");
            return;
        }

        // 데이터베이스에서 username이 rUsername인 계정을 찾습니다.
        var userAccount = await Account.findOne({username: rUsername});
        //계정이 있으면
        if(userAccount != null) {
            // 계정이 존재하면 비밀번호를 확인합니다.
            if(rPassword == userAccount.password){
                // 비밀번호가 일치하면 마지막 인증 시간을 갱신합니다.
                userAccount.lastAuthentication = Date.now();
                await userAccount.save();
                
                console.log("Reverting account...");
                
                /**
                 * 여기서 res.send(newAccount)는 
                 * Express.js 프레임워크에서 사용되는 코드로, 
                 * HTTP 응답(response)을 클라이언트로 전송하는 역할을 합니다.
                 */
                res.send(userAccount);
                return;
            }
        }
        
        // 비밀번호가 일치하지 않으면 "Invalid credentials" 메시지를 반환합니다.
        res.send("Invalid credentials");
        return;
    });


    // 라우터 설정
    app.post('/account/create', async(req, res) => {
        console.log(req.body);
        // req에서 username과 password를 가져옵니다.
        const {rUsername, rPassword} = req.body;
        
        // username이나 password가 없으면 "Invalid credentials" 메시지를 반환합니다.
        if(rUsername == null || rPassword == null) {
            res.send("Invalid credentials");
            return;
        }

        // 데이터베이스에서 username이 rUsername인 계정을 찾습니다.
        var userAccount = await Account.findOne({username: rUsername});
        
        // 계정이 존재하지 않으면 새 계정을 만듭니다.
        if(userAccount == null) {
            // 새로운 계정을 생성합니다.
            console.log("Create new account...");

            var newAccount = new Account({
                username: rUsername,           // MongoDB에 있는 username에 rUsername값으로 설정
                password: rPassword,           // MongoDB에 있는 password에 rPassword값으로 설정
                lastAuthentication: Date.now() // 현재 시간을 마지막 인증 시간으로 설정합니다.
            });

            // 새로운 계정을 데이터베이스에 저장합니다.
            await newAccount.save();

            /**
             * 여기서 res.send(newAccount)는 
             * Express.js 프레임워크에서 사용되는 코드로, 
             * HTTP 응답(response)을 클라이언트로 전송하는 역할을 합니다.
             */
            res.send(newAccount);
            return;
        } else {
            res.send("Username is already taken");
        }
        
        return;
    });
}
