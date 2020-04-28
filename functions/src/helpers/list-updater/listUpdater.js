const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../firebase-paths/firebasePaths');
const idManager = require('../id-manager/idManager');

exports.update = async ({admin,
                        editor,
                        shoppingListId,
                        productId,
                        productUpdater,
                        totalItemsCount,
                        completedItemsCount}) => {
    if (!admin ||
        !editor ||
        !shoppingListId ||
        !productId ||
        !productUpdater) {
        return {updates: undefined, error: statusTypes.BAD_REQUEST_DATA};
    }

    const updates = {};
    const updateTimestamp = Date.now();

    const {listPath,
        listCardPath,
        productPath,
        listSenderPath,
        listReceiversPath} = getUpdatePaths({shoppingListId, productId});

    if (!listPath || listPath.length <= 0 ||
        !listCardPath || listCardPath.length <= 0 ||
        !productPath || productPath.length <= 0 ||
        !listSenderPath || listSenderPath.length <= 0 ||
        !listReceiversPath || listReceiversPath.length <= 0) {
        return {updates: undefined, error: statusTypes.BAD_REQUEST_DATA};
    }

    const {listSendersIds, listReceiversIds} = await getUsersIds({admin, editor, listSenderPath, listReceiversPath});

    if (!listSendersIds || !listReceiversIds) {
        return {updates: undefined, error: statusTypes.BAD_REQUEST_DATA};
    }

    updateList({updates, listPath, totalItemsCount, completedItemsCount, updateTimestamp});
    updateListCard({updates, listCardPath, totalItemsCount, completedItemsCount, updateTimestamp});
    updateProduct({updates, productPath, productUpdater, updateTimestamp});
    updateSender({updates, listSendersIds, shoppingListId, updateTimestamp});
    updateReceivers({updates, listReceiversIds, shoppingListId, updateTimestamp});

    return {updates, error: undefined};
};

const getUpdatePaths = ({shoppingListId, productId}) => {
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

    return {listPath, listCardPath, productPath, listSenderPath, listReceiversPath};
};

const getUsersIds = async ({admin, editor, listSenderPath, listReceiversPath}) => {
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

    return {listSendersIds, listReceiversIds};
};

const updateList = ({updates, listPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
    // Обновляем данные в списке покупок.
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

    return {updates};
};

const updateListCard = ({updates, listCardPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
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

    return {updates};
};

const updateProduct = ({updates, productUpdater, productPath, updateTimestamp}) => {
    productUpdater.data.updates = updates;
    productUpdater.data.productPath = productPath;
    productUpdater.data.updateTimestamp = updateTimestamp;

    productUpdater.run();

    return {updates};
};

const updateSender = ({updates, listSendersIds, shoppingListId, updateTimestamp}) => {
    // Обновляем время последнего обновления списка покупок у создателя списка.
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

    return {updates};
};

const updateReceivers = ({updates, listReceiversIds, shoppingListId, updateTimestamp}) => {
    // Обновляем время последнего обновления списка покупок у получателей списка.
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

    return {updates};
};

// const getUpdateData = async ({admin, editor, shoppingListId, productId}) => {
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
//         listCardPath,
//         productPath,
//         listReceiversPath,
//         listSendersIds,
//         listReceiversIds};
// };

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

// exports.updateShoppingList = ({updates, listPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
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
// };

// exports.updateShoppingListCard = ({updates, listCardPath, completedItemsCount, totalItemsCount, updateTimestamp}) => {
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
// };
//
// exports.updateProduct = () => {
//
// };

// exports.updateUsers = ({updates, shoppingListId, updateTimestamp, listSendersIds, listReceiversIds}) => {
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
// };

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
