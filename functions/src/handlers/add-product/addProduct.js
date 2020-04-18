const statusTypes = require('../../data/common/statusTypes');
const listUpdater = require('../../helpers/list-updater/listUpdater');
const productUpdaters = require('../../helpers/list-updater/product-updater/productUpdaters');

exports.addProductHandler = async ({req, res, admin}) => {
    const requestData = req.body;

    const {
        editor,
        shoppingListId,
        product,
        completedItemsCount,
        totalItemsCount,
    } = requestData;

    if (!editor ||
        !shoppingListId ||
        !product) {
        res.json({
            status: statusTypes.BAD_REQUEST_DATA,
        });
        return;
    }

    const productUpdater = productUpdaters.get(productUpdaters.types.ADD_PRODUCT);
    productUpdater.data.product = product;

    const {updates, error} = await listUpdater
        .update({admin,
            editor,
            shoppingListId,
            completedItemsCount,
            totalItemsCount,
            productId: product.id,
            productUpdater});

    if (error) {
        console.log('addProduct()->ERROR: ' + error);
        res.json({status: error,});
        return;
    }

    // Применяем обновление.
    await admin.database().ref().update(updates);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
