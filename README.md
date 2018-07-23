# LogHandler

![npm version](https://badge.fury.io/js/loghandler.svg)![npm](https://img.shields.io/npm/dm/loghandler.svg?style=flat)[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1e8f0869660d4f67bfcf5aa482ae9f70)](https://www.codacy.com/app/michel_5/LogHandler?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=michelbitter/LogHandler&amp;utm_campaign=Badge_Grade)[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/1e8f0869660d4f67bfcf5aa482ae9f70)](https://www.codacy.com/app/michelbitter/LogHandler?utm_source=github.com&utm_medium=referral&utm_content=michelbitter/LogHandler&utm_campaign=Badge_Coverage)

A fully tested strongly typed (typescript), and modular log handler that gives you easy the possibility to send your applications log messages in a async way to every system you prefer. LogHandler can be used in every nodeJS project, no matter of typescript is on top of it.


## How it works
LogHandler uses a reporters to report log items to certain destinations like `console`, `syslog,` `rollbar`, `trackjs`. To make this plugin as modular as possible I didn't add any reporters into this plugin. Seperate reporters need to be installed or self developed before LogHandler is capable to report log items. Further down in this readme I provide you with a full lists of publicly available reporters. Beside that you can find some instructions about how to create your own reporter even in the bottom of this readme.

### Installation
You can install LogHandler pretty easy. Just by installing the package with node package manager. For Typescript users: The definitions are provided in the plugin. To install the plugin:
```
npm install --save loghandler
``` 

## Usage

```
import loghandler from 'loghandler'

const config = {
  reporters: []
  reporting: {
    silent: false
    minimalLevel2Report: 'debug'
  }
}

const log = loghandler(config)


try{
  throw new Error("Something goes wrong!")
}catch(err){
  log.emerg(err)
}
```

**Options**

| Name                            | Default | Description                                                                               |
| ------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `reporters`                     | []      | list of all reporters                                                                     |
| `reporting.silent`              | false   | if true loghandler doesn't send logevent to all reporters.                                |
| `reporting.minimalLevel2Report` | debug   | the minimal logging level that any logevent should have before the reportes got notified. |

**Commands**
Loghandler implements the syslog Message Serverties as they are provided in RFC 5424. This means that you're able to log events on different levels depanding on impact of the event. In LogHandler each severty level has there own command. In combination with the setting `reporting.minimalLevel2Report` you can add debug logevents in your application without that the reporters will be notified in a production environment. The full list of commands is:

 See the list below:

| Code | Command   | Description                              |
| ---- | --------- | ---------------------------------------- |
| 0    | `emerg`   | Emergency: system is unusable            |
| 1    | `alert`   | Alert: action must be taken immediately  |
| 2    | `crit`    | Critical: critical conditions            |
| 3    | `err`     | Error: error conditions                  |
| 4    | `warning` | Warning: warning conditions              |
| 5    | `notice`  | Notice: normal but significant condition |
| 6    | `info`    | Informational: informational messages    |
| 7    | `debug`   | Debug: debug-level messages              |

The input arguments of each command is the same. Each command must have at least a string input or Error message, but other attributes can be provided as well. Each command has the following format:
`logHandler.emerg(msg: string | Error, data?: {[key: string]: any}, ...args: any[]) => void`

**Typescript**
For the developers who want to use LogHandler in combination with Typescript. I exported the general definitions that you need to setup LogHandler. There are two defitions available:

| definition  | Description                                |
| ----------- | ------------------------------------------ |
| `Config`    | Interface with all available config values |
| `LogLevels` | Literal Type with all available log levels |


## Reporters
As explained before. LogHandler use reporters to report logevents to certain systems. LogHandler itself can't report logevents without reporters. So it's important in every installation that you setup at least 1. I tried to make it as easy as possible to make your own reporters, but it's ofcourse okay to use one that is already publicly available. 

### How to create your own reporters
To make your own reporter isn't hard at all. I tried to make it as easy as possible so that everybody could implement their own way of logging. To create your own reporter you need to make a reporter. How to make it differs a little of you using JavaScript or Typescript. For each language here an example:


**Javascript:**
```
class reporter {
  constructor(){
    this.name = 'Example reporter'
    this.timeout = 2500
  }

  async log(logObj) {
    // Put here your reporter code
    console.log(obj)
  }
}
```

**Typescript:**
```
class reporter implements ReportersInterface {
  public readonly name = 'Example reporter'
  public readonly timeOut = 2500

  async log(obj: LogObjectInterface) {
    // Put here your reporter code
    console.log(obj)
  }
}
```

However i think the examples speak for themself i want to explain you certain things. First all reporters need a name. This to report an error to other setted reporters when something goes wrong in your own developed reporter. Second there is an option to set a timeOut (ms) for eacht reporter. The timeOut is optional, but it is there to make sure that other reporters get informed as soon when the connection establishment to a tirth party takes to long. 

Thirth you see that the reporters class requires an log method. This is the method where the magic happens. The method has one argument what is the complete log event object. The log event object looks like: 

| key       | type   | Description                                                                                                                                               |
| --------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| level     | number | The numeric code of the log level *See table 2*                                                                                                           |
| error     | Error  | The error message that is send to logHandler. If log is given as a string. Loghandler transforms it to an Error to make sure the stacktrace is available. |
| data      | {}     | The data object. (second argument of any logHandler command)                                                                                              |
| args      | []     | An array of all other arguments that are given to LogHandler                                                                                              |
| createdAt | Date   | The exact date when LogHandler received the logevent                                                                                                      |



### List of publicly available reporters

As far as I know there aren't any publicly available reporters jet. I'm happy to add your reporter here as soon when you make it open source and publicly available. If you did just make a Pull Request with and change this readme and don't forget to add yourself to the Contributers ;-).


## Contributers
[Michel Bitter](https://github.com/michelbitter) *(author)*
[Codacy Badger](https://github.com/codacy-badger) *(bot)*