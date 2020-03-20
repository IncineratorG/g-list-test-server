const statusTypes = require('../../data/common/statusTypes');

exports.shareShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const senderPhone = requestData.sender;
    const receiversPhones = requestData.receivers;
    const shoppingListCard = requestData.shoppingListCard;
    const shoppingList = requestData.shoppingList;
    const units = requestData.units;
    const classes = requestData.classes;

    if (!receiversPhones || receiversPhones.length <= 0 ||
        !senderPhone || senderPhone.length <= 0 ||
        !shoppingListCard ||
        !shoppingList ||
        !units ||
        !classes) {
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

    const shoppingListDescription = Object.assign({}, shoppingList);
    delete shoppingListDescription.productsList;

    const sharedListRef = admin.database().ref('/shared/shoppingLists').push();

    const secondUpdates = {};
    secondUpdates['/shared/shoppingLists/' + sharedListRef.key] = {
        sender: senderPhone,
        shoppingListCard,
        shoppingList: shoppingListDescription,
    };
    await admin.database().ref().update(secondUpdates);

    const thirdUpdates = {};
    classes.forEach(cls => {
        const clsKey = admin
            .database()
            .ref('/shared/shoppingLists/' + sharedListRef.key + '/classes')
            .push()
            .key;
        thirdUpdates['/shared/shoppingLists/' + sharedListRef.key + '/classes/' + clsKey] = cls;
    });
    units.forEach(unit => {
        const unitKey = admin
            .database()
            .ref('/shared/shoppingLists/' + sharedListRef.key + '/units')
            .push()
            .key;
        thirdUpdates['/shared/shoppingLists/' + sharedListRef.key + '/units/' + unitKey] = unit;
    });
    receiversPhones.forEach(receiverPhone => {
        const receiverPhoneKey = admin
            .database()
            .ref('/shared/shoppingLists/' + sharedListRef.key + '/receivers')
            .push()
            .key;
        thirdUpdates['/shared/shoppingLists/' + sharedListRef.key + '/receivers/' + receiverPhoneKey] = receiverPhone;
    });
    shoppingList.productsList.forEach(product => {
        const productKey = admin
            .database()
            .ref('/shared/shoppingLists/' + sharedListRef.key + '/shoppingList/productsList')
            .push()
            .key;
        thirdUpdates['/shared/shoppingLists/' + sharedListRef.key + '/shoppingList/productsList/' + productKey] = product;
    });

    thirdUpdates['/users/' + senderPhone + '/send/' + sharedListRef.key] = {
        id: sharedListRef.key,
        shoppingListCard: shoppingListCard
    };
    receiversDbData.forEach(data => {
        thirdUpdates['/users/' + data.phone + '/received/' + sharedListRef.key] = {
            id: sharedListRef.key,
            touched: false,
            shoppingListCard: shoppingListCard
        };
    });
    await admin.database().ref().update(thirdUpdates);

    res.json({
        status: statusTypes.SUCCESS,
        sharedListKey: sharedListRef.key,
    });
};

// exports.shareShoppingListHandler = async ({req, res, admin}) => {
//     const requestData = req.body;
//
//     const senderPhone = requestData.sender;
//     const receiversPhones = requestData.receivers;
//     const shoppingListCard = requestData.shoppingListCard;
//
//     if (!receiversPhones || receiversPhones.length <= 0 ||
//         !senderPhone || senderPhone.length <= 0 ||
//         !shoppingListCard) {
//         res.json({
//             status: statusTypes.BAD_REQUEST_DATA,
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
//     let receiversDbData = await Promise.all(
//         receiversPhones.map(async receiverPhone => {
//             const receiverDbData = await admin.database().ref('/users/' + receiverPhone).once('value');
//             if (receiverDbData.exists()) {
//                 return {phone: receiverPhone, token: receiverDbData.val().token};
//             } else {
//                 return {phone: undefined, token: undefined};
//             }
//         }),
//     );
//
//     receiversDbData = receiversDbData.filter(data => data.phone && data.token);
//     if (!receiversDbData.length) {
//         res.json({
//             status: statusTypes.USER_NOT_EXIST,
//         });
//         return;
//     }
//
//     const sharedListRef = await admin.database().ref('/shared/shoppingLists').push(req.body);
//
//     let updates = {};
//     updates['/users/' + senderPhone + '/send/' + sharedListRef.key] = {
//         id: sharedListRef.key,
//         shoppingListCard: shoppingListCard
//     };
//     receiversDbData.forEach(data => {
//         updates['/users/' + data.phone + '/received/' + sharedListRef.key] = {
//             id: sharedListRef.key,
//             touched: false,
//             shoppingListCard: shoppingListCard
//         };
//     });
//     await admin.database().ref().update(updates);
//
//     res.json({
//         status: statusTypes.SUCCESS,
//         sharedListKey: sharedListRef.key,
//     });
// };
