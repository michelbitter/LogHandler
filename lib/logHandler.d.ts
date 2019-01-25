/// <reference types="node" />
import * as events from 'events';
import { LogHandlerDependencies, Config, LogHandlerResults } from './interfaces';
export declare class LogHandler {
    private deps;
    private config;
    static factory(config: Config): LogHandler;
    constructor(deps: LogHandlerDependencies, config: Config);
    getLogHandler(): LogHandlerResults;
    private logFnc;
    getEmitter(): events;
}
export default LogHandler;
