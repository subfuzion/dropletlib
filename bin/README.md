DigitalOcean shell scripts
==========================

## Required environment variables

  * DIGITALOCEAN_CLIENTID
  * DIGITALOCEAN_APIKEY

## Pretty Output

Pipe command output through jsontool:

    <cmd> | json

Show a specific property

    <cmd> | json images

More complex filtering with JavaScript code

    <cmd> | json images | json -c "public === false" -o inspect'

Install jsontool

    npm install -g jsontool

