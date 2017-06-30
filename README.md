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

## Areas for improvement

* There's lots of input lag that could almost certainly be eliminated with some further 
  optimization of the Apollo/React/GraphQL code
* Some "debouncing"/delay on the comment input would be nice to reduce the 
  amount of network traffic while typing
* Pressing ENTER to add a topic instead of clicking the button would be great
* Possible race condition when adding comments could result in an "extra" comment
  for a user which could never be edited afterwards.
* Use GraphQL subscriptions for live updates to other browsers.  Currently only 
  the tab you are looking at updates as you type.
* Add unit tests, so show how that works with GraphQL / MongoDB mocking.  The
  client can run tests with a mock GraphQL instance I believe, and the server should
  be able to be tested without any MongoDB running.
* It would have been nice to use the same advanced ECMAscript features in the server
  as in the UI (e.g. import syntax) (babel-node)
* Authentication using JWT / Auth0 or similar

## Running

To run the GraphQL server backend:

    cd quarrelly-server && npm start

Then in another console, run the frontend dev server, which does live reload and other good stuff:

    cd quarrelly-ui && npm start

Then you can access the app at http://localhost:3000/ .

