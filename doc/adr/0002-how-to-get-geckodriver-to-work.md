# 2. How to get geckodriver to work

Date: 2021-10-25

## Status

Accepted

## Context

By default, when you try and use firefox with selenium you get this error:

```
/home/ben/sauce/celery/node_modules/selenium-webdriver/firefox.js:434
    throw Error(
          ^

Error: The geckodriver executable could not be found on the current PATH. Please download the latest version from https://github.com/mozilla/geckodriver/releases/ and ensure it can be found on your PATH.
    at findGeckoDriver (/home/ben/sauce/celery/node_modules/selenium-webdriver/firefox.js:434:11)
    at new ServiceBuilder (/home/ben/sauce/celery/node_modules/selenium-webdriver/firefox.js:527:22)
    at Function.createSession (/home/ben/sauce/celery/node_modules/selenium-webdriver/firefox.js:583:21)
    at createDriver (/home/ben/sauce/celery/node_modules/selenium-webdriver/index.js:148:33)
    at Builder.build (/home/ben/sauce/celery/node_modules/selenium-webdriver/index.js:706:16)
    at /home/ben/sauce/celery/dist/core/commands/companies-command.js:20:9
    at Generator.next (<anonymous>)
    at /home/ben/sauce/celery/dist/core/commands/companies-command.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/home/ben/sauce/celery/dist/core/commands/companies-command.js:4:12)

```

## Decision

Looks like all you need to do is this:

```ts
require('geckodriver');
```

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.
