import { ReportersInterface, LogObjectInterface } from '../..';
export declare class ConsoleReporter implements ReportersInterface {
    readonly name = "Console reporter";
    readonly timeOut = 2500;
    log(obj: LogObjectInterface): Promise<void>;
}
