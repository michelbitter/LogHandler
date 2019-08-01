/// <reference types="node" />
import * as events from 'events';
import * as Joi from '@hapi/joi';
import * as lodash from 'lodash';
import { Logger } from './logger';
export interface Config {
    readonly reporters: ReportersInterface[];
    readonly reporting?: {
        readonly silent?: boolean;
        readonly minimalLevel2Report?: LogLevels;
    };
}
export interface Dependencies {
    readonly joi: typeof Joi;
    readonly logEmitter: events;
    readonly _: typeof lodash;
}
export interface LogHandlerDependencies extends Dependencies {
    logger: Logger;
}
export interface LogObjectInterface {
    readonly level: number;
    readonly error: Error;
    readonly data: {
        [key: string]: any;
    };
    readonly args: any[];
    readonly createdAt: Date;
}
export declare const LogLevels: {
    emerg: "emerg";
    alert: "alert";
    crit: "crit";
    err: "err";
    warning: "warning";
    notice: "notice";
    info: "info";
    debug: "debug";
};
export declare type LogLevels = keyof typeof LogLevels;
export declare const LogLevelsKeys: ("emerg" | "alert" | "crit" | "err" | "warning" | "notice" | "info" | "debug")[];
export interface ReportersInterface {
    readonly name: string;
    readonly log: (logObject: LogObjectInterface) => Promise<void>;
    readonly timeOut?: number;
}
export declare type LoggerInstance = (msg: string | Error, data?: {
    [key: string]: any;
}, ...args: any[]) => void;
export declare type LogHandlerResults = {
    readonly [key in LogLevels]: LoggerInstance;
};
