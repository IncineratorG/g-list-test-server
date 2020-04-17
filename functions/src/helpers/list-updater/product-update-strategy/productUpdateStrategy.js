const firebasePaths = require('../../firebase-paths/firebasePaths');

exports.get = (type) => {
  switch (type) {
    case exports.strategies.ADD_PRODUCT: {
      let strategyData = {updates: undefined, productPath: undefined, product: undefined};
      const addProductStrategy = () => {
        const {updates, productPath, product} = strategyData;
        updates[productPath] = product;
      };

      return {run: addProductStrategy, data: strategyData, type: exports.strategies.ADD_PRODUCT};
    }

    case exports.strategies.REMOVE_PRODUCT: {
      let strategyData = {updates: undefined, productPath: undefined };
      const removeProductStrategy = () => {
        const {updates, productPath} = strategyData;
        updates[productPath] = null;
      };

      return {run: removeProductStrategy, data: strategyData, type: exports.strategies.REMOVE_PRODUCT};
    }

    case exports.strategies.UPDATE_STATUS: {
      let strategyData = {updates: undefined, productPath: undefined, status: undefined, updateTimestamp: undefined};
      const updateStatusStrategy = () => {
        const {updates, productPath, status, updateTimestamp} = strategyData;
        updates[
            productPath +
            firebasePaths.d +
            firebasePaths.folderNames.COMPLETION_STATUS
            ] = status;
        updates[
            productPath + firebasePaths.d + firebasePaths.folderNames.UPDATE_TIMESTAMP
            ] = updateTimestamp;
      };

      return {run: updateStatusStrategy, data: strategyData, type: exports.strategies.UPDATE_STATUS};
    }
  }

  return undefined;
};

exports.strategies = {
    ADD_PRODUCT: 'ADD_PRODUCT',
    REMOVE_PRODUCT: 'REMOVE_PRODUCT',
    UPDATE_STATUS: 'UPDATE_STATUS',
};
