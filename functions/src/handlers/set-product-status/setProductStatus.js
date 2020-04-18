const statusTypes = require('../../data/common/statusTypes');
const listUpdater = require('../../helpers/list-updater/listUpdater');
const productUpdaters = require('../../helpers/list-updater/product-updater/productUpdaters');

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

    const productUpdater = productUpdaters.get(productUpdaters.types.UPDATE_STATUS);
    productUpdater.data.status = status;

    const {updates, error} = await listUpdater
        .update({admin,
            editor,
            shoppingListId,
            completedItemsCount,
            totalItemsCount,
            productId,
            productUpdater});

    if (error) {
        console.log('setProductStatus()->ERROR: ' + error);
        res.json({status: error,});
        return;
    }

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
