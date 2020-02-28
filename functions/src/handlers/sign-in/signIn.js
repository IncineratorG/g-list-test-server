const statusTypes = require('../../data/common/statusTypes');

exports.signInHandler = async ({req, res, admin}) => {
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

    const snapshot = await admin.database().ref('/users/' + phone).once('value');
    if (!snapshot.exists()) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    if (snapshot.val().password !== password) {
        res.json({
            status: statusTypes.BAD_PASSWORD,
        });
        return;
    }

    if (snapshot.val().token !== deviceToken) {
        await admin.database().ref('/users').child(phone).update({token: deviceToken});
    }

    res.json({
        status: statusTypes.SUCCESS,
    });
};
