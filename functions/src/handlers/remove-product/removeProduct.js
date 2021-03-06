const statusTypes = require('../../data/common/statusTypes');
const listUpdater = require('../../helpers/list-updater/listUpdater');
const productUpdaters = require('../../helpers/list-updater/product-updater/productUpdaters');

exports.removeProductHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {
        editor,
        shoppingListId,
        productId,
        completedItemsCount,
        totalItemsCount,
    } = requestData;

    if (!editor ||
        !shoppingListId ||
        !productId) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const productUpdater = productUpdaters.get(productUpdaters.types.REMOVE_PRODUCT);

    const {updates, error} = await listUpdater
        .update({admin,
            editor,
            shoppingListId,
            completedItemsCount,
            totalItemsCount,
            productId,
            productUpdater});

    if (error) {
        console.log('removeProduct()->ERROR: ' + error);
        res.json({status: error,});
        return;
    }

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};

// exports.removeProductHandler = async ({req, res, admin}) => {
//     const requestData = req.body;
//
//     const {
//         editor,
//         shoppingListId,
//         productId,
//         completedItemsCount,
//         totalItemsCount,
//     } = requestData;
//
//     if (!editor ||
//         !shoppingListId ||
//         !productId) {
//         res.json({
//             status: statusTypes.BAD_REQUEST_DATA,
//         });
//         return;
//     }
//
//     // Путь до списка покупок.
//     const listPath = firebasePaths.getPath({
//         pathType: firebasePaths.paths.SHOPPING_LIST,
//         shoppingListId,
//     });
//     // Путь до карточки списка покупок.
//     const listCardPath = firebasePaths.getPath({
//         pathType: firebasePaths.paths.SHOPPING_LIST_CARD,
//         shoppingListId,
//     });
//     // Путь до продукта в списке покупок.
//     const productPath = firebasePaths.getPath({
//         pathType: firebasePaths.paths.PRODUCT,
//         shoppingListId,
//         productId: productId,
//     });
//     // Путь до создателя списка.
//     const listSenderPath = firebasePaths.getPath({
//         pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
//         shoppingListId,
//     });
//     // Путь до получателей списка.
//     const listReceiversPath = firebasePaths.getPath({
//         pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
//         shoppingListId,
//     });
//
//     if (listPath.length <= 0 || listCardPath.length <= 0 || productPath <= 0) {
//         console.log(
//             'removeProductHandler->BAD_PATH_LENGTH: ' +
//             listPath.length + '-' +
//             listCardPath.length + '-' +
//             productPath.length
//         );
//         res.json({
//             status: statusTypes.BAD_REQUEST_DATA,
//         });
//         return;
//     }
//
//     // Получаем данные создателя списка.
//     const listSenderData = await admin
//         .database()
//         .ref(listSenderPath)
//         .once('value');
//     // Получаем данные получателей списка.
//     const listReceiversData = await admin
//         .database()
//         .ref(listReceiversPath)
//         .once('value');
//
//     // Получаем ID создателя и получателей списка.
//     const listSendersIds = [];
//     const listReceiversIds = [];
//
//     if (listSenderData.val() !== editor) {
//         listSendersIds.push(
//             idManager.getId(listSenderData.val())
//         );
//     }
//     listReceiversData.forEach(child => {
//         if (child.val() !== editor) {
//             listReceiversIds.push(
//                 idManager.getId(child.val())
//             );
//         }
//     });
//
//     const updateTimestamp = Date.now();
//
//     // Обновляем данные в списке покупок.
//     const updates = {};
//     updates[
//         listPath +
//         firebasePaths.d +
//         firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
//         ] = completedItemsCount;
//     updates[
//         listPath + firebasePaths.d + firebasePaths.folderNames.TOTAL_ITEMS_COUNT
//         ] = totalItemsCount;
//     updates[
//         listPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
//         ] = updateTimestamp;
//
//     // Обновляем данные в карточке списка покупок.
//     updates[
//         listCardPath +
//         firebasePaths.d +
//         firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
//         ] = completedItemsCount;
//     updates[
//         listCardPath +
//         firebasePaths.d +
//         firebasePaths.folderNames.TOTAL_ITEMS_COUNT
//         ] = totalItemsCount;
//     updates[
//         listCardPath +
//         firebasePaths.d +
//         firebasePaths.folderNames.UPDATE_TIMESTAMP
//         ] = updateTimestamp;
//
//     // Удаляем продукт.
//     updates[productPath] = null;
//
//     // Обновляем время последнего обновления списка покупок у создателя и получателей списка.
//     listSendersIds.forEach(senderId => {
//         const userSendPath = firebasePaths.getPath({
//             pathType: firebasePaths.paths.USER_SEND_DELIM,
//             userId: senderId,
//         });
//         updates[
//             userSendPath +
//             shoppingListId +
//             firebasePaths.d +
//             firebasePaths.folderNames.UPDATE_TIMESTAMP
//             ] = updateTimestamp;
//     });
//     listReceiversIds.forEach(receiverId => {
//         const userReceivedPath = firebasePaths.getPath({
//             pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
//             userId: receiverId,
//         });
//         updates[
//             userReceivedPath +
//             shoppingListId +
//             firebasePaths.d +
//             firebasePaths.folderNames.UPDATE_TIMESTAMP
//             ] = updateTimestamp;
//     });
//
//     // Применяем обновление.
//     await admin.database().ref().update(updates);
//
//     res.json({
//         status: statusTypes.SUCCESS,
//     });
// };
