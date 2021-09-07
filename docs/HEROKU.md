# Heroku

+   [Heroku: Deploying Code](https://devcenter.heroku.com/articles/git#deploying-code)

## CLI

### Create Heroku App

```bash
# create a new application called 'app-name'
heroku create app-name

# create a new application with a random name
heroku create
```

### Add Plugins

```bash
# add heroku-postgresql to the application
heroku addons:create heroku-postgresql:hobby-dev
```

> obs.: this step creates a environment variable called DATABASE_URL="postgres://username:password@host:port/"

### Deploying

```bash
# list git remote repositories
git remote --verbose

# output:
# heroku  https://git.heroku.com/ts-dummy.git (fetch)
# heroku  https://git.heroku.com/ts-dummy.git (push)
# origin  https://github.com/PedroZC90/ts-express.git (fetch)
# origin  https://github.com/PedroZC90/ts-express.git (push)
```

```bash
# deploy branch 'master' from github to git remote heroku
git push heroku master

# deploy branch 'heroku' from github to git remote heroku
git push heroku heroku:master
```

> obs.: on the [dashboard](https://dashboard.heroku.com) > project > deploy you can link a project branch to automatic deploy.

```bash
# ensure that at least one instance of the app is running
heroku ps:scale web=1
```

```bash
# open app
heroku open
```

```bash
# set new environmental variable for the application
heroku config:set JWT_SECRET_KEY="secret"
heroku config:set JWT_EXPIRATION="24h"
```

## Utilities

```bash
# open heroku console
heroku run bash
```

```bash
# follow aplication logs
heroku logs --tail
```

```bash
# list all remote repositories from the current branch
git remote -v

# delete remote repositories depolyed to heroku
# (usefull to delete deploy after using 'git push heroku <branch>:master')
git remote rm heroku
```

```bash
# display heroku application postgres information
heroku pg:info

# open postgres console linked to the application
# (requires psql install on the machine)
heroku pg:psql
```

## Problems

### Repository Not Found

If you rename a heroku app the git remote can throw a error.

```bash
# list heroku apps
heroku apps

# output:
# ts-dummy

cat .git/config

# output
# [core]
#         repositoryformatversion = 0
#         filemode = false
#         bare = false
#         logallrefupdates = true
#         symlinks = false
# [remote "origin"]
#         url = https://github.com/PedroZC90/ts-express.git
#         fetch = +refs/heads/*:refs/remotes/origin/*
# [branch "master"]
#         remote = origin
#         merge = refs/heads/master
# [remote "heroku"]
#         url = https://git.heroku.com/ancient-dawn-17533.git
#         fetch = +refs/heads/*:refs/remotes/heroku/*
# [branch "heroku"]
#         remote = origin
#         merge = refs/heads/heroku
```
