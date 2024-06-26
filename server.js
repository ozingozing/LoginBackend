/**
 * express 모듈을 가져와서 express라는 상수에 할당합니다.
 * express는 Node.js에서 웹 애플리케이션을 만들기 위한 
 * 프레임워크로, 라우팅 및 미들웨어 기능을 제공합니다.
 */
const express = require('express');
/**
 * ./config/keys.js 파일에서 설정 값을 가져와
 * keys라는 상수에 할당합니다.
 * 이 파일은 데이터베이스 URI와 같은 
 * 중요한 설정 정보를 담고 있습니다. 
 * 예를 들어, keys.js 파일은 다음과 같은 
 * 형태일 수 있습니다:
 */
const keys = require('./config/keys.js');
/**
 * express 함수(모듈에서 가져온 것)를 호출하여 
 * app 객체를 생성합니다.
 * app 객체는 서버 애플리케이션의 인스턴스로, 
 * 라우팅과 미들웨어를 설정하는데 사용됩니다.
 */
const app = express();

const bodyParser = require('body-parser');

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * mongoose 모듈을 가져와서 mongoose라는 상수에 할당합니다.
 * mongoose는 MongoDB와 Node.js 애플리케이션을 
 * 연결해주는 ODM(Object Data Modeling) 라이브러리로, 
 * 스키마 정의와 데이터 모델링을 쉽게 할 수 있게 해줍니다.
 */
const mongoose = require('mongoose');
/**
 * keys 객체에서 mongoURI 속성을 가져와 
 * MongoDB 데이터베이스에 연결합니다.
 * mongoose.connect 메서드는 
 * MongoDB에 연결을 설정하고 연결이 성공하면 
 * 이후 데이터베이스 작업을 할 수 있게 해줍니다.
 */
//Setting up DB
mongoose.connect(keys.mongoURI);

//Setup database models
require('./model/Account.js');

//Setup the routes
require('./routes/authenticationRoutes')(app);

app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});