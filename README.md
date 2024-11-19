# Admin Portal Setup Guide

This document provides instructions on how to build, run, and obtain the build files for the Admin Portal of the Webshop application.

## 1. Building the Docker Image

Before running the application, you need to build the Docker image. To do this, open a terminal and run the following command:

```bash
docker build -t admin-portal .
```

This will build the Docker image with the tag `admin-portal`.

## 2. Running the Container

After building the image, you can run the Admin Portal container. To start it, execute the following command:

```bash
docker run --rm --network="host" admin-portal
```

**Explanation**:

- `--rm`: Automatically removes the container once it stops, so no cleanup is required.
- `--network="host"`: Ensures that the container shares the host machine's network, allowing it to access backend services running on the host.

This command will start the Admin Portal, and you can access it at `http://localhost:3000` on your machine (or use the IP for the host machine, depending on your network setup).

## 3. Obtaining Build Files (Optional)

If you need to retrieve the build artifacts (such as the `.next` directory) generated during the build process, you can copy them from the container to your local machine.

Follow these steps:

### 1. Run the container in detached mode

```bash
docker run -d --name admin-portal admin-portal sleep 3600
```

- `-d`: Runs the container in detached mode (in the background).
- `sleep 3600`: Keeps the container running for 1 hour, so you have time to copy the build files.

### 2. Copy the build files from the container to your local machine

```bash
sudo docker cp admin-portal:/admin-portal/.next .
```

This will copy the `.next` directory from the container's `/admin-portal/.next` path to your current directory on the host machine.

### 3. Clean up

After you've copied the necessary files, stop and remove the container to clean up:

```bash
docker stop admin-portal
docker rm admin-portal
```

## Additional Notes

- Ensure that Docker is installed and running on your machine before you attempt to build or run the container.
- If you're working with a remote backend, make sure it's configured to allow access from the container (e.g., by using `host.docker.internal` on Docker for Mac/Windows or setting up proper IP access on Linux).
