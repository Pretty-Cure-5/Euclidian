#!/usr/bin/env bash
# Synchronisation script to pull apps from GitHub into SAGE2.
# (This just needs to be called by a web-based request; unimplemented.)

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
killall node

################################################################################
# Update Apps                                                                  #
################################################################################
cd "$repo"
git pull --all
cp -r "$repo"/SAGE2/* "$apps"

################################################################################
# The website is up.com                                                        #
################################################################################
cd "$sage"
nohup node server.js -li &
