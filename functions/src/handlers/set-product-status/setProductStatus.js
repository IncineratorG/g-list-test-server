const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');
const listUpdater = require('../../helpers/list-updater/listUpdater');
const productUpdateStrategy = require('../../helpers/list-updater/product-update-strategy/productUpdateStrategy');
const pipeline = require('../../helpers/list-updater/pipeline');
const test = require('../../helpers/list-updater/test');

const {TestClass} = require('../../helpers/list-updater/TestClass');

exports.setProductStatusHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {
        editor,
        shoppingListId,
        productId,
        status,
        completedItemsCount,
        totalItemsCount,
    } = requestData;

    if (!editor ||
        !shoppingListId ||
        !productId ||
        !status) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const tc1 = new TestClass();
    tc1.inc();

    console.log(tc1.get());

    const tc2 = new TestClass();
    tc2.inc();
    tc2.inc();

    console.log(tc2.get());

    // test.inc();
    // console.log(test.testVals.counter);


    // const operations = [];
    // const transitions = {};
    //
    // const firstOperation = {executable: undefined, data: undefined};
    // operations.push(firstOperation);
    //
    // const secondOperation = {executable: undefined, data: undefined};
    // operations.push(secondOperation);
    //
    // const thirdOperation = {executable: undefined, data: undefined};
    // operations.push(thirdOperation);
    //
    //
    //
    // pipeline.run({operations, transitions});



    // const strategy = productUpdateStrategy.get(productUpdateStrategy.strategies.ADD_PRODUCT);
    // await listUpdater.update({productUpdateStrategy: strategy});



    // const updates = {};
    //
    // const strategy = productUpdateStrategy.getStrategy(productUpdateStrategy.strategies.ADD_PRODUCT);
    // strategy.data.updates = updates;
    // strategy.data.productPath = 'MyPath';
    // strategy.data.product = { name: 'prod', value: '23' };
    //
    // strategy.run();
    //
    // console.log('UPDATES: ' + JSON.stringify(updates));


    // const {listPath,
    //     listCardPath,
    //     productPath,
    //     listReceiversPath,
    //     listSendersIds,
    //     listReceiversIds} = await listUpdater.getUpdateData({admin, editor, shoppingListId, productId});
    //
    // const updates = {};
    // const updateTimestamp = Date.now();
    //
    // listUpdater.updateShoppingList({updates, listPath, completedItemsCount, totalItemsCount, updateTimestamp});
    // listUpdater.updateShoppingListCard({updates, listCardPath, completedItemsCount, totalItemsCount, updateTimestamp});
    // listUpdater.updateProduct();
    // listUpdater.updateUsers({updates, listSendersIds, listReceiversIds, shoppingListId, updateTimestamp});



    // const strategy = productUpdateStrategy.getStrategy(productUpdateStrategy.strategies.ADD_PRODUCT);
    //
    // const {updates, error} = await listUpdater.makeUpdates({admin, requestData, productUpdateStrategy: strategy});
    // if (error) {
    //     res.json({
    //         status: error,
    //     });
    //     return;
    // }

    // // Применяем обновление.
    // await admin.database().ref().update(updates);



    // // Путь до списка покупок.
    // const listPath = firebasePaths.getPath({
    //     pathType: firebasePaths.paths.SHOPPING_LIST,
    //     shoppingListId,
    // });
    // // Путь до карточки списка покупок.
    // const listCardPath = firebasePaths.getPath({
    //     pathType: firebasePaths.paths.SHOPPING_LIST_CARD,
    //     shoppingListId,
    // });
    // // Путь до продукта в списке покупок.
    // const productPath = firebasePaths.getPath({
    //     pathType: firebasePaths.paths.PRODUCT,
    //     shoppingListId,
    //     productId,
    // });
    // // Путь до создателя списка.
    // const listSenderPath = firebasePaths.getPath({
    //     pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
    //     shoppingListId,
    // });
    // // Путь до получателей списка.
    // const listReceiversPath = firebasePaths.getPath({
    //     pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
    //     shoppingListId,
    // });
    //
    // if (listPath.length <= 0 || listCardPath.length <= 0 || productPath <= 0) {
    //     console.log(
    //         'setProductStatusHandler->BAD_PATH_LENGTH: ' +
    //         listPath.length + '-' +
    //         listCardPath.length + '-' +
    //         productPath.length
    //     );
    //     res.json({
    //         status: statusTypes.BAD_REQUEST_DATA,
    //     });
    //     return;
    // }

    // // Получаем данные создателя списка.
    // const listSenderData = await admin
    //     .database()
    //     .ref(listSenderPath)
    //     .once('value');
    // // Получаем данные получателей списка.
    // const listReceiversData = await admin
    //     .database()
    //     .ref(listReceiversPath)
    //     .once('value');
    //
    // // Получаем ID создателя и получателей списка.
    // const listSendersIds = [];
    // const listReceiversIds = [];

    // if (listSenderData.val() !== editor) {
    //     listSendersIds.push(
    //         idManager.getId(listSenderData.val())
    //     );
    // }
    // listReceiversData.forEach(child => {
    //     if (child.val() !== editor) {
    //         listReceiversIds.push(
    //             idManager.getId(child.val())
    //         );
    //     }
    // });
    //
    // const updateTimestamp = Date.now();

    // // Обновляем данные в списке покупок.
    // const updates = {};
    // updates[
    // listPath +
    // firebasePaths.d +
    // firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
    //     ] = completedItemsCount;
    // updates[
    // listPath + firebasePaths.d + firebasePaths.folderNames.TOTAL_ITEMS_COUNT
    //     ] = totalItemsCount;
    // updates[
    // listPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
    //     ] = updateTimestamp;

    // // Обновляем данные в карточке списка покупок.
    // updates[
    // listCardPath +
    // firebasePaths.d +
    // firebasePaths.folderNames.COMPLETED_ITEMS_COUNT
    //     ] = completedItemsCount;
    // updates[
    // listCardPath +
    // firebasePaths.d +
    // firebasePaths.folderNames.TOTAL_ITEMS_COUNT
    //     ] = totalItemsCount;
    // updates[
    // listCardPath +
    // firebasePaths.d +
    // firebasePaths.folderNames.UPDATE_TIMESTAMP
    //     ] = updateTimestamp;

    // // Обновляем данные продукта.
    // updates[
    // productPath +
    // firebasePaths.d +
    // firebasePaths.folderNames.COMPLETION_STATUS
    //     ] = status;
    // updates[
    // productPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
    //     ] = updateTimestamp;

    // Обновляем время последнего обновления списка покупок у создателя и получателей списка.
    // listSendersIds.forEach(senderId => {
    //     const userSendPath = firebasePaths.getPath({
    //         pathType: firebasePaths.paths.USER_SEND_DELIM,
    //         userId: senderId,
    //     });
    //     updates[
    //     userSendPath +
    //     shoppingListId +
    //     firebasePaths.d +
    //     firebasePaths.folderNames.UPDATE_TIMESTAMP
    //         ] = updateTimestamp;
    // });
    // listReceiversIds.forEach(receiverId => {
    //     const userReceivedPath = firebasePaths.getPath({
    //         pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
    //         userId: receiverId,
    //     });
    //     updates[
    //     userReceivedPath +
    //     shoppingListId +
    //     firebasePaths.d +
    //     firebasePaths.folderNames.UPDATE_TIMESTAMP
    //         ] = updateTimestamp;
    // });

    // // Применяем обновление.
    // await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};

// exports.setProductStatusHandler = async ({req, res, admin}) => {
//     const requestData = req.body;
//
//     const {
//         editor,
//         shoppingListId,
//         productId,
//         status,
//         completedItemsCount,
//         totalItemsCount,
//     } = requestData;
//
//     if (!editor ||
//         !shoppingListId ||
//         !productId ||
//         !status) {
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
//             'setProductStatusHandler->BAD_PATH_LENGTH: ' +
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
//     // Обновляем данные продукта.
//     updates[
//         productPath +
//         firebasePaths.d +
//         firebasePaths.folderNames.COMPLETION_STATUS
//         ] = status;
//     updates[
//         productPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
//         ] = updateTimestamp;
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
