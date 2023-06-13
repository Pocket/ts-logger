# Typescript Logger

This repository contains a simple, baseline logger setup for use in various Typescript apps. It is meant to be extensible. It comes with an optional morgan middleware setup function as well, for logging HTTP requests and responses.

## Example Usage

### Generic Setup
You can use this logger in most generic Typescript functions.

```
TBD
```

### For server-level specific logs:
* will get & embed the RELEASE_SHA environment variable into the log message metadata, if present

```
TBD
```

### For lambda-level specific logs:
* will get & embed the RELEASE_SHA environment variable into the log message metadata, if present

```
TBD
```

### For HTTP request & response specific logs via Morgan Express Middleware:
* will get & embed the RELEASE_SHA environment variable into the log message metadata, if present
* message will have all http headers for requests & responses

```
TBD
```

### For HTTP specific logs via server context objects:
* will get & embed the RELEASE_SHA environment variable into the log message metadata, if present
* will get & embed the user id header, request id, and trace id request headers in log message metadata, if present

```
TBD
```

### For GraphQL specific logs via server context objects & Apollo hooks:
* will get & embed the RELEASE_SHA environment variable into the log message metadata, if present
* will get & embed the user id header, request id, and trace id request headers in log message metadata, if present

```
TBD
```
