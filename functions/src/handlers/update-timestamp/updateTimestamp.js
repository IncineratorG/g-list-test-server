const statusTypes = require('../../data/common/statusTypes');

exports.updateTimestampHandler = async ({req, res, admin}) => {
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

    const listSenders = [];
    const listReceivers = [];

    if (listSenderData.val() !== editorPhone) {
        listSenders.push(listSenderData.val());
    }
    listReceiversData.forEach(child => {
        if (child.val() !== editorPhone) {
            listReceivers.push(child.val());
        }
    });

    const currentDate = Date.now();
    const updates = {};
    listSenders.forEach(senderPhone => {
        updates['/users/' + senderPhone + '/send/' + shoppingListId + '/updateTimestamp'] = currentDate;
    });
    listReceivers.forEach(receiverPhone => {
        updates['/users/' + receiverPhone + '/received/' + shoppingListId + '/updateTimestamp'] = currentDate;
    });

    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
