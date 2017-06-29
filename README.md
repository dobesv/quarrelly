This is a little test project to play with React + GraphQL + MongoDB.

## Setup

I suggest running this in a separate Linux VM, as I do.  Set up nginx to proxy
to the dev servers, e.g.:

    $ cat > /etc/nginx/sites-enabled/default  << EOF
    server {
      listen 80 default_server;
      listen [::]:80 default_server;

      server_name _;

      location / {
        proxy_pass http://127.0.0.1:3000;
      }

      location /graphql {
        proxy_pass http://127.0.0.1:8000;
      }

      location /graphiql {
        proxy_pass http://127.0.0.1:8000;
      }
    }
    EOF

Now you can run the GraphQL server backend:

    cd *-server && npm start

Then in a new console you can run the react dev server:

    cd *-ui && npm start

And then can play with the app!