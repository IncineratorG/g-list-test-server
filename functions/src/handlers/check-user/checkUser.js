const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');

exports.checkUserHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {email} = requestData;

    if (!email || email.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const userId = idManager.getId(email);

    const userPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER,
        userId: userId,
    });

    const snapshot = await admin.database().ref(userPath).once('value');
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
