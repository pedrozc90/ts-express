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

```bash
# update package.json
npx npm-check-updates --target latest --upgrade
```

### TypeORM

```bash
# create a new migration file called 'src/migrations/<timestamp>-create-file-storage.ts'
npx typeorm migration:create src/migrations/create-file-storage
```

## License

Please see [LICENSE](./LICENSE) file.
