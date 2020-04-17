exports.run = ({operations, transitions}) => {
    let prevOp = undefined;
    let currentOp = undefined;

    operations.forEach(operation => {
        currentOp = operation;

        prevOp = operation;
    });
};
