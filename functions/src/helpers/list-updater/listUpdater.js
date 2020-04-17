const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../firebase-paths/firebasePaths');
const idManager = require('../id-manager/idManager');

exports.update = async ({admin, editor, shoppingListId, productId, productUpdateStrategy}) => {
    const {listPath,
        listCardPath,
        productPath,
        listReceiversPath,
        listSendersIds,
        listReceiversIds} = await getUpdateData({admin, editor, shoppingListId, productId});
};

const getUpdateData = async ({admin, editor, shoppingListId, productId}) => {
    // Путь до списка покупок.
    const listPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST,
        shoppingListId,
    });
    // Путь до карточки списка покупок.
    const listCardPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_CARD,
        shoppingListId,
    });
    // Путь до продукта в списке покупок.
    const productPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.PRODUCT,
        shoppingListId,
        productId: productId,
    });
    // Путь до создателя списка.
    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId,
    });
    // Путь до получателей списка.
    const listReceiversPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
        shoppingListId,
    });

    // Получаем данные создателя списка.
    const listSenderData = await admin
        .database()
        .ref(listSenderPath)
        .once('value');
    // Получаем данные получателей списка.
    const listReceiversData = await admin
        .database()
        .ref(listReceiversPath)
        .once('value');

    // Получаем ID создателя и получателей списка.
    const listSendersIds = [];
    const listReceiversIds = [];

    if (listSenderData.val() !== editor) {
        listSendersIds.push(
            idManager.getId(listSenderData.val())
        );
    }
    listReceiversData.forEach(child => {
        if (child.val() !== editor) {
            listReceiversIds.push(
                idManager.getId(child.val())
            );
        }
    });

    return {listPath,
        listCardPath,
        productPath,
        listReceiversPath,
        listSendersIds,
        listReceiversIds};
};

// exports.getUpdateData = async ({admin, editor, shoppingListId, productId}) => {
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
//     return {listPath,
//             listCardPath,
//             productPath,
//             listReceiversPath,
//             listSendersIds,
//             listReceiversIds};
// };

exports.updateShoppingList = ({updates, listPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
    updates[
        listPath +
        firebasePaths.d +
        firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
        ] = completedItemsCount;
    updates[
        listPath + firebasePaths.d + firebasePaths.folderNames.TOTAL_ITEMS_COUNT
        ] = totalItemsCount;
    updates[
        listPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;
};

exports.updateShoppingListCard = ({updates, listCardPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
    // Обновляем данные в карточке списка покупок.
    updates[
        listCardPath +
        firebasePaths.d +
        firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
        ] = completedItemsCount;
    updates[
        listCardPath +
        firebasePaths.d +
        firebasePaths.folderNames.TOTAL_ITEMS_COUNT
        ] = totalItemsCount;
    updates[
        listCardPath +
        firebasePaths.d +
        firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;
};

exports.updateProduct = () => {

};

exports.updateUsers = ({updates, shoppingListId, updateTimestamp, listSendersIds, listReceiversIds}) => {
    // Обновляем время последнего обновления списка покупок у создателя и получателей списка.
    listSendersIds.forEach(senderId => {
        const userSendPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_SEND_DELIM,
            userId: senderId,
        });
        updates[
            userSendPath +
            shoppingListId +
            firebasePaths.d +
            firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });
    listReceiversIds.forEach(receiverId => {
        const userReceivedPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: receiverId,
        });
        updates[
            userReceivedPath +
            shoppingListId +
            firebasePaths.d +
            firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });
};

// exports.makeUpdates = async ({admin, requestData, productUpdateStrategy}) => {
//     const {
//         editor,
//         shoppingListId,
//         productId,
//         completedItemsCount,
//         totalItemsCount,
//     } = requestData;
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
//         productId,
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
//             'listUpdater->makeUpdates(): BAD_PATH_LENGTH: ' +
//             listPath.length + '-' +
//             listCardPath.length + '-' +
//             productPath.length
//         );
//         return {updates: undefined, error: statusTypes.BAD_REQUEST_DATA};
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
//
//     // ===
//
//     // ===
//
//     // ===
//     // // Обновляем данные продукта.
//     // updates[
//     // productPath +
//     // firebasePaths.d +
//     // firebasePaths.folderNames.COMPLETION_STATUS
//     //     ] = status;
//     // updates[
//     // productPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
//     //     ] = updateTimestamp;
//     // ===
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
//     return {updates, error: undefined};
// };
