const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');

exports.shareShoppingListHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const senderEmail = requestData.sender;
    const receiversEmails = requestData.receivers;
    const shoppingListCard = requestData.shoppingListCard;
    const shoppingList = requestData.shoppingList;
    const units = requestData.units;
    const classes = requestData.classes;

    if (!receiversEmails || receiversEmails.length <= 0 ||
        !senderEmail || senderEmail.length <= 0 ||
        !shoppingListCard ||
        !shoppingList ||
        !units ||
        !classes) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const senderId = idManager.getId(senderEmail);
    const receiversIds = receiversEmails.map(email => idManager.getId(email));

    const senderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER,
        userId: senderId,
    });
    const senderDbData = await admin.database().ref(senderPath).once('value');
    if (!senderDbData.exists()) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    let receiversDbData = await Promise.all(
        receiversIds.map(async id => {
            const receiverPath = firebasePaths.getPath({
                pathType: firebasePaths.paths.USER,
                userId: id,
            });
            const receiverDbData = await admin.database().ref(receiverPath).once('value');
            if (receiverDbData.exists()) {
                return {id: id, token: receiverDbData.val().token};
            } else {
                return {id: undefined, token: undefined};
            }
        }),
    );

    receiversDbData = receiversDbData.filter(data => data.id && data.token);
    if (!receiversDbData.length) {
        res.json({
            status: statusTypes.USER_NOT_EXIST,
        });
        return;
    }

    const shoppingListRootPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LISTS_DATA_ROOT,
    });
    const sharedListRef = admin.database().ref(shoppingListRootPath).push();

    const shoppingListDescription = Object.assign({}, shoppingList);
    shoppingListDescription.id = sharedListRef.key;
    delete shoppingListDescription.productsList;

    const firstUpdates = {};
    const shoppingListPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_DATA,
        shoppingListId: sharedListRef.key
    });
    firstUpdates[shoppingListPath] = {
        sender: senderEmail,
        shoppingListCard,
        shoppingList: shoppingListDescription,
    };
    await admin.database().ref().update(firstUpdates);

    const secondUpdates = {};
    classes.forEach(cls => {
        const clsKey = admin
            .database()
            .ref(shoppingListPath +
                firebasePaths.d +
                firebasePaths.folderNames.CLASSES)
            .push()
            .key;
        secondUpdates[
            shoppingListPath +
            firebasePaths.d +
            firebasePaths.folderNames.CLASSES +
            firebasePaths.d +
            clsKey
            ] = cls;
    });
    units.forEach(unit => {
        const unitKey = admin
            .database()
            .ref(shoppingListPath +
                firebasePaths.d +
                firebasePaths.folderNames.UNITS)
            .push()
            .key;
        secondUpdates[
            shoppingListPath +
            firebasePaths.d +
            firebasePaths.folderNames.UNITS +
            firebasePaths.d +
            unitKey
            ] = unit;
    });
    receiversEmails.forEach(receiverEmail => {
        const listReceiversPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
            shoppingListId: sharedListRef.key,
        });
        const receiverKey = admin
            .database()
            .ref(listReceiversPath)
            .push()
            .key;
        secondUpdates[listReceiversPath + firebasePaths.d + receiverKey] = receiverEmail;
    });
    shoppingList.productsList.forEach(product => {
        const productsListPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.PRODUCTS_LIST,
            shoppingListId: sharedListRef.key,
        });
        const productKey = admin
            .database()
            .ref(productsListPath)
            .push()
            .key;

        product.id = productKey;
        product.parentId = sharedListRef.key;

        secondUpdates[productsListPath + firebasePaths.d + productKey] = product;
    });

    const currentDate = Date.now();

    const userSendPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_SEND_DELIM,
        userId: senderId,
    });
    secondUpdates[userSendPath + sharedListRef.key] = {
        id: sharedListRef.key,
        updateTimestamp: currentDate,
    };
    receiversDbData.forEach(data => {
        const userReceivedPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: data.id
        });
        secondUpdates[userReceivedPath + sharedListRef.key] = {
            id: sharedListRef.key,
            updateTimestamp: currentDate,
            touched: false,
        };
    });
    await admin.database().ref().update(secondUpdates);

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
