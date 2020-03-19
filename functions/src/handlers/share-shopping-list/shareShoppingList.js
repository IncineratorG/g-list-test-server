const statusTypes = require('../../data/common/statusTypes');

exports.shareShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const senderPhone = requestData.sender;
    const receiversPhones = requestData.receivers;

    if (!receiversPhones || receiversPhones.length <= 0 ||
        !senderPhone || senderPhone.length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
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

    let receiversDbData = await Promise.all(
        receiversPhones.map(async receiverPhone => {
            const receiverDbData = await admin.database().ref('/users/' + receiverPhone).once('value');
            if (receiverDbData.exists()) {
                return {phone: receiverPhone, token: receiverDbData.val().token};
            } else {
                return {phone: undefined, token: undefined};
            }
        }),
    );

    receiversDbData = receiversDbData.filter(data => data.phone && data.token);
    if (!receiversDbData.length) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    const sharedListRef = await admin.database().ref('/shared/shoppingLists').push(req.body);

    let updates = {};
    updates['/users/' + senderPhone + '/send/' + sharedListRef.key] = { id: sharedListRef.key };
    receiversDbData.forEach(data => {
        updates['/users/' + data.phone + '/received/' + sharedListRef.key] = { id: sharedListRef.key }
    });
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
        sharedListKey: sharedListRef.key,
    });
};

// exports.shareShoppingListHandler = async ({req, res, admin}) => {
//     const requestData = req.body;
//
//     const receiverPhone = requestData.receiver;
//     const senderPhone = requestData.sender;
//     // const shoppingList = requestData.shoppingList;
//     // const usedUnits = requestData.usedUnits;
//     // const usedClasses = requestData.usedClasses;
//
//     if (!receiverPhone || receiverPhone.length <= 0 ||
//         !senderPhone || senderPhone.length <= 0) {
//         res.json({
//             status: statusTypes.BAD_REQUEST_DATA,
//         });
//         return;
//     }
//
//     const receiverDbData = await admin.database().ref('/users/' + receiverPhone).once('value');
//     if (!receiverDbData.exists()) {
//         res.json({
//             status: statusTypes.USER_NOT_EXIST,
//         });
//         return;
//     }
//
//     const senderDbData = await admin.database().ref('/users/' + senderPhone).once('value');
//     if (!senderDbData.exists()) {
//         res.json({
//             status: statusTypes.USER_NOT_EXIST,
//         });
//         return;
//     }
//
//     const receiverToken = receiverDbData.val().token;
//     const senderToken = receiverDbData.val().token;
//
//     const sharedListRef = await admin.database().ref('/shared/shoppingLists').push(req.body);
//     console.log('SAVED_LIST_KEY: ' + sharedListRef.key);
//
//     let updates = {};
//     updates['/users/' + senderPhone + '/send/' + sharedListRef.key] = { id: sharedListRef.key };
//     updates['/users/' + receiverPhone + '/received/' + sharedListRef.key] = { id: sharedListRef.key };
//
//     await admin.database().ref().update(updates);
//
//     // const message = {
//     //     token: receiverToken,
//     //     data: {
//     //         textMessage,
//     //     },
//     //     android: {
//     //         priority: 'high',
//     //     },
//     // };
//     //
//     // try {
//     //     const response = await admin.messaging().send(message);
//     //     console.log('SUCCESSFULLY_SENT_MESSAGE');
//     // } catch (e) {
//     //     console.log('ERROR: ' + e);
//     // }
//
//     res.json({
//         status: statusTypes.SUCCESS,
//         sharedListKey: sharedListRef.key,
//     });
// };
