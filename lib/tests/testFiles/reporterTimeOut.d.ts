import * as sinon from 'sinon';
export declare class Instance {
    readonly name = "Test Timeout Reporter";
    readonly timeOut = 5;
    constructor();
    log(...args: any[]): Promise<unknown>;
}
declare const _default: {
    Instance: typeof Instance;
    stub: {
        log: sinon.SinonStub;
    };
    reset: () => void;
};
export default _default;
