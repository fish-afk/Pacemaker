# Pacemaker

A custom c2 framework project for a custom made malware client.

This project is solely intended to be used for educational purposes.

The framework is still under heavy development and is not meant to work as expected, because of different configs on each of your machines.

You will need to create you own .env file with following variable/s:

```PORT```

```UPLOADKEY```

But please make sure you have the following versions:

```node v16.18.1```

```npm v8.10.0```

clone the repo then run:

```npm install```

```node server.js```

for a continuous development experience:

```npm install -g nodemon```

```nodemon server.js```

Docker build:

```docker build -t pacemaker_c2 .```

Docker run:

```docker run -d -p3000:3000 pacemaker_c2```


