import { Config, ReportersInterface, LogObjectInterface, LogLevels, LogHandlerResults } from './interfaces';
declare const logHandler: (config: Config) => LogHandlerResults;
export default logHandler;
export declare type ReportersInterface = ReportersInterface;
export declare type Config = Config;
export declare type LogObjectInterface = LogObjectInterface;
export declare type LogLevels = LogLevels;
export declare type Log = LogHandlerResults;
export declare const logLevelsKeys: ("emerg" | "alert" | "crit" | "err" | "warning" | "notice" | "info" | "debug")[];
