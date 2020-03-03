const statusTypes = require('../../data/common/statusTypes');

exports.sendMessageHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const receiverPhone = requestData.receiver;
    const senderPhone = requestData.sender;
    const textMessage = requestData.textMessage;

    if (!receiverPhone || receiverPhone.length <= 0 ||
        !senderPhone || senderPhone.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const receiverDbData = await admin.database().ref('/users/' + receiverPhone).once('value');
    if (!receiverDbData.exists()) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    const senderDbData = await admin.database().ref('/users/' + senderPhone).once('value');
    if (!senderDbData.exists()) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    const receiverToken = receiverDbData.val().token;
    const senderToken = receiverDbData.val().token;

    const message = {
        token: receiverToken,
        data: {
            textMessage,
        },
        android: {
            priority: 'high',
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('SUCCESSFULLY_SENT_MESSAGE');
    } catch (e) {
        console.log('ERROR: ' + e);
    }

    res.json({
        status: statusTypes.SUCCESS,
    });
};
