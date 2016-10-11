#!/usr/bin/env bash
# [admin-based interface]
# System-wide update script for Ubuntu/NeCTAR

################################################################################
# Configuration                                                                #
################################################################################
read -r home < <(head -n 1 ./etc/home);
repo="$home"/Euclidian;
sage="$home"/sage2;
apps="$sage"/public/uploads/apps;
sync="$repo"/Server;

################################################################################
# http://thewebsiteisdown.com/                                                 #
################################################################################
killall node npm;
kill -9 "$(ps x | awk '/node server\.js -li/{print $1}')";

# The firewall is down.com
sudo iptables -A OUTPUT -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT;
sudo iptables -A INPUT  -m state --state RELATED,ESTABLISHED     -j ACCEPT;

################################################################################
# Update Apps                                                                  #
################################################################################
cd "$sync";
perl sync.pl;

################################################################################
# Update Server                                                                #
################################################################################
sudo apt-get -y update;
sudo apt-get -y dist-upgrade;
sudo apt-get -y autoremove;
sudo apt-get -y autoclean;

################################################################################
# Update Node                                                                  #
################################################################################
#cd "$sage";
#npm run in;
#npm install;
#npm update;

################################################################################
# The website is up.com                                                        #
################################################################################
cd "$sage";
nohup node server.js -li &
cd "$sync";
nohup node sys.js -li &

# The firewall is up.com
sudo iptables -D OUTPUT -m state --state NEW,RELATED,ESTABLISHED -j ACCEPT;
sudo iptables -D INPUT  -m state --state RELATED,ESTABLISHED     -j ACCEPT;
