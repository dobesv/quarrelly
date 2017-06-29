This is a little test project to play with React + Apollo GraphQL + MongoDB.

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

    cd quarrelly-server && npm start

Then in another console, run the frontend dev server, which does live reload and other good stuff:

    cd quarrelly-ui && npm start

Then you can access the app at http://localhost/ .

If you choose to forego the nginx proxy, you can probably insert the server URL in 
quarrelly-ui/src/index.js to specify http://localhost:8000/ as a parameter to 
the ApolloClient constructor.
