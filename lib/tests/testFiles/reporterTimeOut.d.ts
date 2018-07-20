import * as sinon from 'sinon';
export declare class Instance {
    readonly name: string;
    readonly timeOut: number;
    constructor();
    log(...args: any[]): Promise<{}>;
}
declare const _default: {
    Instance: typeof Instance;
    stub: {
        log: sinon.SinonStub;
    };
    reset: () => void;
};
export default _default;
