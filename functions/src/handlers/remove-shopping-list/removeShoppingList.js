const statusTypes = require('../../data/common/statusTypes');

exports.removeShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {shoppingListId} = requestData;
    if (!shoppingListId) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const senderData = await admin
        .database()
        .ref('/shared/shoppingLists/' + shoppingListId + '/sender')
        .once('value');

    const receiversData = await admin
        .database()
        .ref('/shared/shoppingLists/' + shoppingListId + '/receivers')
        .once('value');

    const senderPhone = senderData.val();
    const receiversPhones = receiversData.val();

    let updates = {};
    updates['/users/' + senderPhone + '/send/' + shoppingListId] = null;
    receiversPhones.forEach(receiverPhone => {
        updates['/users/' + receiverPhone + '/received/' + shoppingListId] = null;
    });
    updates['/shared/shoppingLists/' + shoppingListId] = null;

    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
