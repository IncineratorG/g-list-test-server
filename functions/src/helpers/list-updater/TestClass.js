class TestClass {
    constructor() {
        this.counter = 0;
    }

    inc() {
        this.counter = this.counter + 1;
    }

    get() {
        return this.counter;
    }
}

module.exports.TestClass = TestClass;
