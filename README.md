# Installation

Required are:
 *  `npm`, the node.js package manager
 * `bower`, the frontend package manager (install via `npm install -g bower`)
 * mongodb

Follow these steps to get the application up and running

* Open a terminal
* Clone the repo, as usual with `git clone github.com/flxw/aroundhere && cd aroundhere`
* Install frontend and backend dependencies: `npm install && bower install`
* Start the database (this command will block your shell): `mkdir db && mongod --dbpath db`
* Inflate the database dump and import it: `tar xvJf dump.tar.xz && mongorestore dump`
* Run the application via `node app.js`