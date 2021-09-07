# ts-express

express + typescript restful api boilerplate

> **Important:** Node.js &ge; 14.17, Express &ge; 4.0, TypeScript &ge; 4.4.2

## Commands

```bash
# install dependencies
npm install
```

```bash
# run on development mode
npm run start:dev
```

```bash
# build image, create container and start it using docker-composer + Dockerfile
docker-compose up --build --detach
```

```bash
# find process running on port 9000
netstat -ano | findstr :9000

# kill process
taskkill /pid 1000 /f
```

## Heroku

```bash
# deploy
git push heroku heroku:master
```

```bash
# open app
heroku open
```

```bash
# print out app logs
heroku logs --tail
```

```bash
# open app console
heroku run bash
```

## License

Please see [LICENSE](./LICENSE) file.
