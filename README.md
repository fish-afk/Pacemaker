# Pacemaker

A custom c2 framework for the pacemaker malware.

code for client: https://github.com/fish-afk/PacemakerClient

using docker is recommened.

You will need to create your own .env file with following variable/s:

```PORT```
```UPLOADKEY```
```DBURI```  
```JWT_SECRET```
```REFRESH_SECRET```
```ADMIN_REGISTER_KEY```

recommended node and npm versions:

```node v16.18.1```

```npm v8.10.0```

Make sure you have mongodb installed and the ```DBURI``` environment variable set appropriately and run:

```mongod```

Then run:

```npm install```

```node server.js```

or

```npm install -g nodemon```

```nodemon server.js```

# control flow (not fully up to this standard yet)

![worfkflow image](https://github.com/fish-afk/Pacemaker/blob/main/c2_flow.drawio.png)

# Docker

Docker build:

```docker build -t pacemaker_c2 .```

Docker run:

```docker run -d -p3000:3000 pacemaker_c2```

## Disclaimer: This project is solely intended to be used for educational purposes.
## Note: The project is unfinished. make adjustments and additions as needed.

