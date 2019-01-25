import * as sinon from 'sinon';
export declare class Instance {
    readonly name = "Test Reject Reporter";
    readonly timeOut = 5;
    constructor();
    log(...args: any[]): void;
}
declare const _default: {
    Instance: typeof Instance;
    stub: {
        log: sinon.SinonStub;
    };
    reset: () => void;
};
export default _default;
