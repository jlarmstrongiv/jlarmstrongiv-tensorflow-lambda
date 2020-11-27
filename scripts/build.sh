#!/bin/bash

# install packages in the root repository
# this is necessary for scripts/compress.js to work
echo "log: start"
cd $GITHUB_WORKSPACE
echo "log: begin package install"
npm install
echo "log: end package install"

# copy tfjs-node folder to /tmp and npm install tfjs-node there
# npm install will download/build binaries for tf to run on lambda
cp -R $GITHUB_WORKSPACE/tfjs-node /tmp/tfjs-node
cd /tmp/tfjs-node
echo "log: begin tfjs-node install"
npm install
echo "log: end tfjs-node install"

# inflate all the files built in /tmp/tfjs-node
# and compress it with brotli
cd $GITHUB_WORKSPACE
echo "log: begin compression"
node scripts/compress.js
echo "log: end compression"
