/// <reference types="node" />
import * as events from 'events';
import { LogHandlerDependencies, Config, LogHandlerResults } from './interfaces';
export declare class logHandler {
    private deps;
    private config;
    static factory(config: Config): logHandler;
    constructor(deps: LogHandlerDependencies, config: Config);
    getLogHandler(): LogHandlerResults;
    private logFnc;
    getEmitter(): events;
}
export default logHandler;
