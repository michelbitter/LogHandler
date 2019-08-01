import {LogObjectInterface, ReportersInterface} from '../../'
import * as Rollbar from 'rollbar'

export type RollbarReporterConfig = Rollbar.Configuration

export class RollbarReporter implements ReportersInterface {
  public readonly name = 'Rollbar reporter'
  public readonly timeOut = 10000
  private readonly Rollbar: Rollbar
  private readonly settings: RollbarReporterConfig

  public constructor(settings: RollbarReporterConfig) {
    this.settings = settings
    this.Rollbar = new Rollbar(settings)
  }

  public async log(obj: LogObjectInterface) {
    await new Promise((resolve, reject) => {
      if (this.settings.enabled && this.has2Ignore(obj.level, this.settings.reportLevel)) {
        const lvl = this.GetRollBarLvl(obj.level)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let request: null | {readonly [key: string]: any} = null

        if (obj.data._request) {
          request = obj.data._request
          if (obj.data._user) {
            request = {
              ...request,
              user: obj.data._person,
            }
          }

          if (obj.data._userId) {
            request = {
              ...request,
              userId: obj.data._userId,
            }
          }
        }

        const custom = {
          args: obj.args,
          data: {
            ...obj.data,
            _request: undefined,
            _user: undefined,
            _userId: undefined,
          },
          date: obj.createdAt,
          lvl: obj.level,
        }

        const callback = (err: Error | undefined) => (err ? reject(err) : resolve())

        if (request) {
          this.Rollbar[lvl](obj.error, request, custom, callback)
        } else {
          this.Rollbar[lvl](obj.error, custom, callback)
        }
      } else {
        resolve()
      }
    })
  }

  private GetRollBarLvl(lvl: LogObjectInterface['level']): Rollbar.Level {
    switch (lvl) {
      case 0:
      case 1:
      case 2:
        return 'critical'
      case 3:
        return 'error'
      case 4:
        return 'warning'
      case 5:
      case 6:
        return 'info'
      case 7:
        return 'debug'
    }

    throw new Error(
      `Couldn't send log item to rollbar. Can't determine which rollbar loglvl matches LogHandlers loglvl "${lvl}"`,
    )
  }

  private has2Ignore(lvl: LogObjectInterface['level'], rollbarLevels?: Rollbar.Level) {
    switch (rollbarLevels) {
      case 'critical':
        return lvl <= 2
      case 'debug':
        return false
      case 'error':
        return lvl <= 3
      case 'info':
        return lvl <= 6
      case 'warning':
        return lvl <= 5
      default:
        return false
    }
  }
}
