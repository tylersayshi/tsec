# Thoughts on strategies taken for changes made

I write these to share my thought process and reasoning for rewrite decisions
made. They are the result of my prior experience and opinions formed from that.
If your project needs to rewrite anything in a specifically different way,
please make an issue! The selectors and infrastructure setup in this project
should work well with whatever re-write strategies you'd like.

My goal is to allow a simple path to enabling `erasableSyntaxOnly` for all
projects and not to be overly prescriptive with stylistic decisions.

## Enums

The default case in typescript could be something that is supported for anyone
who needs _exact_ parity, but this feels relatively uncommon and
over-complicated.

```ts
enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
}

var LogLevel;
(function (LogLevel) {
  LogLevel[LogLevel["Debug"] = 0] = "Debug";
  LogLevel[LogLevel["Info"] = 1] = "Info";
  LogLevel[LogLevel["Warning"] = 2] = "Warning";
  LogLevel[LogLevel["Error"] = 3] = "Error";
})(LogLevel || (LogLevel = {}));

// evaluates to
var LogLevel = {
  "0": "Debug",
  "1": "Info",
  "2": "Warning",
  "3": "Error",
  "Debug": 0,
  "Info": 1,
  "Warning": 2,
  "Error": 3,
};
```

The bi-directional lookup here and implicit `key: auto-incrementing` num feels
like logic abstracted away far enough that a sensible replacement could go
relatively unnoticed while also simplifying the code.

### Strategy Taken

Use the string union approach with values that match the keys to preserve any
lookups done for formatting the output value in practice. It is my belief that
LogLevel. `LogLevel.Debug` being 0 is never/rarely the result of developer
intent, but more often a hidden implementation detail that does not need
preserving.

```ts
// before
enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
}

// after
const LogLevel = {
  Debug: "Debug",
  Info: "Info",
  Warning: "Warning",
  Error: "Error",
} as const;
type LogLevelType = typeof LogLevel[keyof typeof LogLevel];
```
