import * as sinon from 'sinon';
export declare class Instance {
    readonly name: string;
    constructor();
    log(...args: any[]): Promise<string>;
}
declare const _default: {
    Instance: typeof Instance;
    stub: {
        log: sinon.SinonStub;
    };
    reset: () => void;
};
export default _default;
