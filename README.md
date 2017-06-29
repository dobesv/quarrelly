This is a little test project to play with React + Apollo GraphQL + MongoDB.

## App Features and Functionality

The app lets you add topics of discussion (something to quarrel about, I suppose).  Then
you can add/edit your comment.  People only get one comment, so when you edit your comment
it updates in-place.

There is no login or authentication system - simply enter your email and it will 
accept that you are who you said you were.  This makes it easy to see the multi-user
support in action!  Gravatars add some color, so using real emails will make things look
more interesting.

Currently you cannot delete Topics, but erasing your comment text will hide it from
the discussion.

## Area for improvement

* The GraphQL usage isn't completely optimized - there's lots of input lag that could
  almost certainly be eliminated with some further digging into Apollo-React techniques
* Some "debouncing"/delay on the comment input would be nice to reduce the 
  number of comment updates while typing
* Pressing ENTER to add a topic instead of clicking the button would be great

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
