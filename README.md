# Pacemaker

A custom c2 framework project for a custom made malware client.

code for client: https://github.com/fish-afk/PacemakerClient

The framework is still under heavy development and is not meant to work as expected, because of different versions on your pc. Hence,
using docker is recommended

You will need to create your own .env file with following variable/s:

```PORT```
```UPLOADKEY```
```DBURI```  
```JWT_SECRET```
```REFRESH_SECRET```
```ADMIN_REGISTER_KEY```

Also please make sure you have the following versions:

```node v16.18.1```

```npm v8.10.0```

Make sure you have mongodb installed and the ```DBURI``` environment variable set appropriately and run:

```mongod```

Then run:

```npm install```

```node server.js```

for a continuous development experience:

```npm install -g nodemon```

```nodemon server.js```

# control flow

![worfkflow image](https://github.com/fish-afk/Pacemaker/blob/main/c2_flow.drawio.png)

# Docker

Docker build:

```docker build -t pacemaker_c2 .```

Docker run:

```docker run -d -p3000:3000 pacemaker_c2```

## Disclaimar: This project is solely intended to be used for educational purposes.
## Note: this project is unfinished. make adjustments and additions as needed.

