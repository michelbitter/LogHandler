/// <reference types="node" />
import { EventEmitter } from 'events';
import { Joi } from 'joi';
import { LoDashStatic } from 'lodash';
export declare enum LogLevels {
    'emerg' = 0,
    'alert' = 1,
    'crit' = 2,
    'err' = 3,
    'warning' = 4,
    'notice' = 5,
    'info' = 6,
    'debug' = 7,
}
export interface LoggerClass {
    new (dependencies: LoggerDependencies, config: {}): LoggerInterface;
}
export interface LoggerDependencies {
    Joi: Joi;
    LogEmitter: EventEmitter;
    _: LoDashStatic;
}
export interface LoggingDependencies {
    Joi: Joi;
    Logger: LoggerClass;
    _: LoDashStatic;
}
export declare type LoggerInstance = (msg: string | Error, data?: {
    [key: string]: any;
}, ...args: any[]) => void;
export declare type LoggingHandlerInterface = (Dependecies: LoggingDependencies, Config: LoggingConfig) => LoggingHandlerResults;
export interface LoggingHandlerResults {
    emerg: LoggerInstance;
    alert: LoggerInstance;
    crit: LoggerInstance;
    error: LoggerInstance;
    warning: LoggerInstance;
    notice: LoggerInstance;
    info: LoggerInstance;
    debug: LoggerInstance;
    emitter(): EventEmitter;
}
export interface LoggerInterface {
    LogLevels: string[];
    Call(LogObject: LogObjectInterface): void;
}
export interface ReportersInterface {
    Name: string;
    TimeOut?: number;
    Log(LogObject: LogObjectInterface): Promise<void>;
}
export interface ReportersClasss {
    new (Options: {
        [key: string]: any;
    }): ReportersInterface;
}
export interface LogObjectInterface {
    level: LogLevels;
    error: Error;
    data: {
        [key: string]: any;
    };
    args: any[];
    createdAt: Date;
}
export interface LoggingConfig {
    reporters: ReportersInterface[];
    reporting?: {
        silent?: boolean;
        minimalLevel2Report?: LogLevels;
    };
}
