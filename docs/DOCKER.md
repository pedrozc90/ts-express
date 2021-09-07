# Dockerfile

## Commands

```bash
# create image using Dockerfile
docker build --tag express-ts --file Dockerfile .

# create image, container and run it with docker-composer
docker-compose up --build --detach

# stop container
docker-compose down
```

## tsconfig.json

```json
{
    "compilerOptions": {
        "outDir": "./dist",
        "rootDir": "./src"
    }
}
```

> **"rootDir": "."** a **src** directory will be created inside **dist**

> **"rootDir": "./src"** the generated files will be extracted inside **dist**

## BusyBox

```bash
# create an image with the current folder's build context
docker build --tag build-context --file - . <<EOF
FROM busybox
WORKDIR /build-context
COPY . /build-context
CMD find .
EOF

# inspect it from a shell using
docker run -it --rm build-context sh
```
