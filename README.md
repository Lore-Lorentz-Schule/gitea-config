# gitea-config Lore-Lorentz-Schule

The configuration files of a self-hosted git ([gitea](https://gitea.io/en-us/)) instance used internally.

## Getting Started

### Install Docker

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

### ENV

To configure all the confidential settings, rename `example.env` to just `.env` and change the values inside.
The description to all of them can be found here: [gitea-docs](https://docs.gitea.io/en-us/config-cheat-sheet/)

Further config can be done in `gitea/gitea/conf/app.ini`

### Running

You can start all the services by running

`docker-compose up -d`

### Updating gitea

1. `docker-compose pull`

2. `docker-compose up -d`

### Creating assets

To change the logos the images in gitea/gitea/public/img/ have to be changed
([Docs](https://docs.gitea.io/en-us/customizing-gitea/#changing-the-logo))
For generating the right size and optimizing gitea provides a own tool. A copy of this tool to run standalone is in ./generate-images, still this tool is using lots of legacy dependencies so it isn't guaranteed to work directly.
! Check for logo changes using a always new incognito window so that no cache is used.