const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');

exports.signUpHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const phone = requestData.phone;
    const email = requestData.email;
    const password = requestData.password;
    const deviceToken = requestData.token;

    if (!phone || phone.length <= 0 ||
        !password || password.length <= 0 ||
        !deviceToken || deviceToken.leading <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const userPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER,
        userId: phone,
    });
    const snapshot = await admin.database().ref(userPath).once('value');
    if (snapshot.exists()) {
        res.json({
            status: statusTypes.USER_ALREADY_EXIST,
        });
        return;
    }

    await admin
        .database()
        .ref(firebasePaths.d + firebasePaths.folderNames.USERS)
        .child(phone)
        .set(
            {
                password: password,
                email: email,
                token: deviceToken,
            }
    );

    res.json({
        status: statusTypes.SUCCESS,
    });
};
