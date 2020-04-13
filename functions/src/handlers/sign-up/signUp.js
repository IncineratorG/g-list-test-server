const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
// const emailConverter = require('../../helpers/email-converter/emailConverter');
const idManager = require('../../helpers/id-manager/idManager');

exports.signUpHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const phone = requestData.phone;
    const email = requestData.email;
    const password = requestData.password;
    const deviceToken = requestData.token;

    if (!email || email.length <= 0 ||
        !password || password.length <= 0 ||
        !deviceToken || deviceToken.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    // const firebaseValidEmail = emailConverter.encodeEmail(email);
    const userId = idManager.getId(email);

    const userPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER,
        userId: userId,
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
        .ref(userPath)
        .set({
                phone: phone,
                email: email,
                password: password,
                token: deviceToken,
            });
    // await admin
    //     .database()
    //     .ref(firebasePaths.d + firebasePaths.folderNames.USERS)
    //     .child(firebaseValidEmail)
    //     .set(
    //         {
    //             phone: phone,
    //             email: email,
    //             password: password,
    //             token: deviceToken,
    //         }
    // );

    res.json({
        status: statusTypes.SUCCESS,
    });
};
