const statusTypes = require('../../data/common/statusTypes');
const idManager = require('../../helpers/id-manager/idManager');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');

exports.notifyUsersHandler = async ({req, res, admin}) => {
    console.log('NOTIFY_USERS_START');

    const requestData = req.body;

    const receivers = requestData.receivers;

    if (!receivers || !receivers.length) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const receiversIds = receivers.map(receiver => {
        return idManager.getId(receiver);
    });

    let receiversTokensData = await Promise.all(
        receiversIds.map(async id => {
            const receiverPath = firebasePaths.getPath({
                pathType: firebasePaths.paths.USER,
                userId: id,
            });
            const receiverDbData = await admin.database().ref(receiverPath).once('value');
            if (receiverDbData.exists()) {
                return {token: receiverDbData.val().token};
            } else {
                return {token: undefined};
            }
        }),
    );
    receiversTokensData = receiversTokensData.filter(data => data.token);

    console.log('LENGTH: ' + receiversTokensData.length);

    if (!receiversTokensData.length) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    const myMessage = 'MY_MESSAGE';
    // receiversTokensData.forEach(data => {
    //     const message = {
    //         token: data.token,
    //         data: {
    //             myMessage,
    //         },
    //         android: {
    //             priority: 'high',
    //         },
    //     };
    //
    //     try {
    //         admin.messaging().send(message);
    //     } catch (e) {
    //         console.log('ERROR: ' + e);
    //     }
    // });
    await Promise.all(receiversTokensData.map(async data => {
        const message = {
            token: data.token,
            data: {
                myMessage,
            },
            android: {
                priority: 'high',
            },
        };

        try {
            await admin.messaging().send(message);
        } catch (e) {
            console.log('ERROR: ' + e);
        }
    }));

    res.json({
        status: statusTypes.SUCCESS,
    });
};
