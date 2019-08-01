/// <reference types="node" />
import * as events from 'events';
import { Config, LogObjectInterface, Dependencies } from './interfaces';
export declare class Logger {
    private deps;
    private config;
    private readonly TIMEOUT;
    static factory(config: Config, eventEmitter?: events): Logger;
    constructor(deps: Dependencies, config: Config);
    call(log: LogObjectInterface): void;
    private timer;
    private report;
    private logOnNewInstance;
}
export default Logger;
