const statusTypes = require('../../data/common/statusTypes');

exports.removeCollaboratorHandler = async ({req, res, admin}) => {
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

    console.log(shoppingListId + ' - ' + collaborator);

    res.json({
        status: statusTypes.SUCCESS,
    });
};
