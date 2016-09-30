#!/usr/bin/env bash
# Synchronisation script to pull apps from GitHub into SAGE2.
# (This just needs to be called by a web-based request; see the README.md file.)

################################################################################
# Configuration                                                                #
################################################################################
home=/home/ubuntu
repo="$home"/Euclidian
sage="$home"/sage2
apps="$sage"/public/uploads/apps/

################################################################################
# http://thewebsiteisdown.com/                                                 #
################################################################################
killall npm #node
kill -9 "$(ps x | awk '/node server\.js -li/{print $1}')";

################################################################################
# Update Apps                                                                  #
################################################################################
cd "$repo"
git pull --all
cp -r "$repo"/SAGE2/* "$apps"
# TODO: minimise JS/JSON files here; and the update.sh file.

################################################################################
# The website is up.com                                                        #
################################################################################
cd "$sage"
nohup node server.js -li &
