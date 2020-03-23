const statusTypes = require('../../data/common/statusTypes');

exports.sendUpdateMessageHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const editorPhone = requestData.editor;
    const shoppingListId = requestData.shoppingListId;

    if (!shoppingListId || shoppingListId.toString().length <= 0 ||
        !editorPhone || editorPhone.toString().length <= 0) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const listSenderData = await admin
        .database()
        .ref('/shared/shoppingLists/' + shoppingListId + '/sender')
        .once('value');
    const listReceiversData = await admin
        .database()
        .ref('/shared/shoppingLists/' + shoppingListId + '/receivers')
        .once('value');

    const userToNotify = [];
    if (listSenderData.val() !== editorPhone) {
        userToNotify.push(listSenderData.val());
    }
    listReceiversData.forEach(child => {
        if (child.val() !== editorPhone) {
            userToNotify.push(child.val());
        }
    });

    await Promise.all(
        userToNotify.map(async userPhone => {
            const userTokenData = await admin
                .database()
                .ref('/users/' + userPhone + '/token')
                .once('value');

            const userToken = userTokenData.val();
            if (userToken !== null) {
                const messageData = {
                    type: 'UPDATE',
                    entity: 'SHOPPING_LIST',
                    entityIds: {
                        shoppingListId
                    }
                };
                const serializedPayload = JSON.stringify(messageData);

                const updateMessage = {
                    token: userToken,
                    data: {
                        serializedPayload,
                    },
                };

                await admin.messaging().send(updateMessage);
            }
        }),
    );

    res.json({
        status: statusTypes.SUCCESS,
    });
};
