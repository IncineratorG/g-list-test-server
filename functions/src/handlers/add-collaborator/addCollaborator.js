const statusTypes = require('../../data/common/statusTypes');
const firebasePaths = require('../../helpers/firebase-paths/firebasePaths');
const idManager = require('../../helpers/id-manager/idManager');

exports.addCollaboratorHandler = async ({req, res, admin}) => {
    const requestData = req.body;
    const {
        shoppingListId,
        collaborator,
    } = requestData;

    if (!shoppingListId ||
        !collaborator) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    // Путь до создателя списка.
    const listSenderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_SENDER,
        shoppingListId
    });
    // Путь до получателей списка.
    const listReceiversPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_RECEIVERS,
        shoppingListId,
    });

    // Получаем данные создателя списка.
    const senderData = await admin
        .database()
        .ref(listSenderPath)
        .once('value');
    // Получаем данные получателей списка.
    const receiversData = await admin
        .database()
        .ref(listReceiversPath)
        .once('value');

    // Получаем ID создателя и получателей списка.
    const senderId = idManager.getId(senderData.val());
    const receiversIds = [];
    receiversData.forEach(child => {
        receiversIds.push(
            idManager.getId(child.val())
        );
    });
    const newCollaboratorId = idManager.getId(collaborator);

    const updateTimestamp = Date.now();

    // Получаем ID нового получаетеля списка.
    const collaboratorKeyRef = admin.database().ref(listReceiversPath).push();

    let updates = {};

    // Обновляем данные создателя списка.
    const senderPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_SEND_DELIM,
        userId: senderId,
    });
    updates[
    senderPath + shoppingListId + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Обновляем данные существующих получателей списка.
    receiversIds.forEach(id => {
        const receiverPath = firebasePaths.getPath({
            pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
            userId: id,
        });
        updates[
            receiverPath + shoppingListId + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
    });

    // Обновляем список покупок.
    const shoppingListPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_DELIM,
        shoppingListId,
    });
    updates[
        shoppingListPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Обновляем карточку списка покупок.
    const shoppingListCardPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.SHOPPING_LIST_CARD_DELIM,
        shoppingListId,
    });
    updates[
        shoppingListCardPath +
        firebasePaths.d +
        firebasePaths.folderNames.UPDATE_TIMESTAMP
        ] = updateTimestamp;

    // Добавляем получателя.
    updates[listReceiversPath + firebasePaths.d + collaboratorKeyRef.key] = collaborator;

    // Добавляем список новому пользователю.
    const newReceiverPath = firebasePaths.getPath({
        pathType: firebasePaths.paths.USER_RECEIVED_DELIM,
        userId: newCollaboratorId,
    });
    updates[newReceiverPath + shoppingListId] = {
        id: shoppingListId,
        updateTimestamp,
        touched: false,
    };

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
