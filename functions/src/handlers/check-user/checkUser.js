const statusTypes = require('../../data/common/statusTypes');

exports.checkUserHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const phone = requestData.phone;

    if (!phone || phone.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
    }

    const snapshot = await admin.database().ref('/users/' + phone).once('value');
    if (snapshot.exists()) {
        res.json({
           status: statusTypes.USER_EXISTS,
        });
    } else {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
    }
};
