exports.getPath = ({pathType, userId, shoppingListId, productId}) => {
    switch (pathType) {
        case exports.paths.USERS_ROOT: {
            return exports.d + exports.folderNames.USERS + exports.d;
        }

        case exports.paths.USER_SEND: {
            if (userId === undefined || userId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_USER_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.USERS +
                    exports.d +
                    userId +
                    exports.d +
                    exports.folderNames.SEND
                );
            }
        }

        case exports.paths.USER_SEND_DELIM: {
            if (userId === undefined || userId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_USER_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.USERS +
                    exports.d +
                    userId +
                    exports.d +
                    exports.folderNames.SEND +
                    exports.d
                );
            }
        }

        case exports.paths.USER_RECEIVED: {
            if (userId === undefined || userId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_USER_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.USERS +
                    exports.d +
                    userId +
                    exports.d +
                    exports.folderNames.RECEIVED
                );
            }
        }

        case exports.paths.USER_RECEIVED_DELIM: {
            if (userId === undefined || userId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_USER_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.USERS +
                    exports.d +
                    userId +
                    exports.d +
                    exports.folderNames.RECEIVED +
                    exports.d
                );
            }
        }

        case exports.paths.SHOPPING_LISTS_DATA_ROOT: {
            return (
                exports.d +
                exports.folderNames.SHARED +
                exports.d +
                exports.folderNames.SHOPPING_LISTS
            );
        }

        case exports.paths.SHOPPING_LISTS_DATA_ROOT_DELIM: {
            return (
                exports.d +
                exports.folderNames.SHARED +
                exports.d +
                exports.folderNames.SHOPPING_LISTS +
                exports.d
            );
        }

        case exports.paths.SHOPPING_LIST_DATA: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId
                );
            }
        }

        case exports.paths.SHOPPING_LIST_DATA_DELIM: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d
                );
            }
        }

        case exports.paths.SHOPPING_LIST_CARD: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST_CARD
                );
            }
        }

        case exports.paths.SHOPPING_LIST_CARD_DELIM: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST_CARD +
                    exports.d
                );
            }
        }

        case exports.paths.SHOPPING_LIST: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST
                );
            }
        }

        case exports.paths.SHOPPING_LIST_DELIM: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST +
                    exports.d
                );
            }
        }

        case exports.paths.PRODUCTS_LIST: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST +
                    exports.d +
                    exports.folderNames.PRODUCTS_LIST
                );
            }
        }

        case exports.paths.PRODUCTS_LIST_DELIM: {
            if (shoppingListId === undefined || shoppingListId.length <= 0) {
                console.log('firebasePaths->getPath() => BAD_SHOPPING_LIST_ID');
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST +
                    exports.d +
                    exports.folderNames.PRODUCTS_LIST +
                    exports.d
                );
            }
        }

        case exports.paths.PRODUCT: {
            if (
                shoppingListId === undefined ||
                shoppingListId.length <= 0 ||
                productId === undefined ||
                productId.length <= 0
            ) {
                console.log(
                    'firebasePaths->getPath() => BAD_SHOPPING_LIST_OR_PRODUCT_ID',
                );
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST +
                    exports.d +
                    exports.folderNames.PRODUCTS_LIST +
                    exports.d +
                    productId
                );
            }
        }

        case exports.paths.PRODUCT_DELIM: {
            if (
                shoppingListId === undefined ||
                shoppingListId.length <= 0 ||
                productId === undefined ||
                productId.length <= 0
            ) {
                console.log(
                    'firebasePaths->getPath() => BAD_SHOPPING_LIST_OR_PRODUCT_ID',
                );
                return '';
            } else {
                return (
                    exports.d +
                    exports.folderNames.SHARED +
                    exports.d +
                    exports.folderNames.SHOPPING_LISTS +
                    exports.d +
                    shoppingListId +
                    exports.d +
                    exports.folderNames.SHOPPING_LIST +
                    exports.d +
                    exports.folderNames.PRODUCTS_LIST +
                    exports.d +
                    productId +
                    exports.d
                );
            }
        }

        default: {
            console.log('firebasePaths->getPath() => UNKNOWN_PATH: ' + pathType);
            return '';
        }
    }
};

exports.paths = {
    USERS_ROOT: 'USERS_ROOT',
    USER_SEND: 'USER_SEND',
    USER_SEND_DELIM: 'USER_SEND_DELIM',
    USER_RECEIVED: 'USER_RECEIVED',
    USER_RECEIVED_DELIM: 'USER_RECEIVED_DELIM',
    SHOPPING_LISTS_DATA_ROOT: 'SHOPPING_LISTS_DATA_ROOT',
    SHOPPING_LISTS_DATA_ROOT_DELIM: 'SHOPPING_LISTS_DATA_ROOT_DELIM',
    SHOPPING_LIST_DATA: 'SHOPPING_LIST_DATA',
    SHOPPING_LIST_DATA_DELIM: 'SHOPPING_LIST_DATA_DELIM',
    SHOPPING_LIST_CARD: 'SHOPPING_LIST_CARD',
    SHOPPING_LIST_CARD_DELIM: 'SHOPPING_LIST_CARD_DELIM',
    SHOPPING_LIST: 'SHOPPING_LIST',
    SHOPPING_LIST_DELIM: 'SHOPPING_LIST_DELIM',
    PRODUCTS_LIST: 'PRODUCTS_LIST',
    PRODUCTS_LIST_DELIM: 'PRODUCTS_LIST_DELIM',
    PRODUCT: 'PRODUCT',
    PRODUCT_DELIM: 'PRODUCT_DELIM',
};

exports.folderNames = {
    USERS: 'users',
    SEND: 'send',
    RECEIVED: 'received',
    SHARED: 'shared',
    SHOPPING_LISTS: 'shoppingLists',
    SHOPPING_LIST: 'shoppingList',
    SHOPPING_LIST_CARD: 'shoppingListCard',
    PRODUCTS_LIST: 'productsList',
    COMPLETED_ITEMS_COUNT: 'completedItemsCount',
    COMPLETION_STATUS: 'completionStatus',
    TOTAL_ITEMS_COUNT: 'totalItemsCount',
    UPDATE_TIMESTAMP: 'updateTimestamp',
};

exports.d = '/';
