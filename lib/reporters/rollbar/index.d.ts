import { LogObjectInterface, ReportersInterface } from '../../';
import * as Rollbar from 'rollbar';
export declare type RollbarReporterConfig = Rollbar.Configuration;
export declare class RollbarReporter implements ReportersInterface {
    readonly name = "Rollbar reporter";
    readonly timeOut = 10000;
    private readonly rollbar;
    private readonly settings;
    constructor(settings: RollbarReporterConfig);
    log(obj: LogObjectInterface): Promise<void>;
    private getRollBarLvl;
    private has2Ignore;
}
