#!/usr/bin/env bash
# Post-installation script for NeCTAR Ubuntu 16.04 LTS (Xenial) amd64.
# # cat IP addresses into ~/phonebook for the firewall scripts
# $ wget -O- 'https://github.com/Pretty-Cure-5/Euclidian/blob/master/Server/install.sh' | bash;

################################################################################
# Human required!                                                              #
################################################################################
printf \\ec;
read -r -p 'Have you got a ~/phonebook? [y/n] ' response;
response=${response,,}; # case insensitivity
if [[ $response =~ ^(no|n)$ ]]; then # RTFM
    printf '\nWell, what are you waiting for; an invitation?!?\n\n';
    exit 1;
fi;
printf '\nI assume you know what you are doing...\n';
sleep 2;
printf '\nHere, before you go; take care of this...\n';
sleep 2;
printf '\n';
yes | sudo apt-get -y install --force-yes iptables-persistent
printf '\nYou are no longer required; this will take a long time...\n';
sleep 5;
printf '\n';

################################################################################
# Configuration                                                                #
################################################################################
home=/home/ubuntu/;
# https://bitbucket.org/sage2/sage2/wiki/
sage2=https://bitbucket.org/sage2/sage2/downloads/SAGE2ubuntu.sh;
# http://openjdk.java.net/install/
jre=openjdk-8-jre;
jdk=openjdk-8-jdk;
# http://www.scala-lang.org/download/
scala=scala-2.11.8.deb;

################################################################################
# Update Server                                                                #
################################################################################
sudo apt-get -y update;
# OMG WTF FFS!!!
yes | sudo apt-get -y dist-upgrade --force-yes;

################################################################################
# Install Packages                                                             #
################################################################################
# SAGE2ubuntu.sh installs git
yes | sudo apt-get -y install --force-yes\
    `#iptables-persistent`\
    "$jre"\
    "$jdk"\
    `#git`\
    vim;
# Fucking iptables-persistent!!!
# I may have to move iptables-persistent to the very front of the line...

################################################################################
# Scala                                                                        #
################################################################################
cd "$home";
wget "http://scala-lang.org/files/archive/$scala";
sudo dpkg -i "$scala";
sudo apt-get -y update;
sudo apt-get -y install scala;

################################################################################
# SAGE2                                                                        #
################################################################################
cd "$home";
wget -O- "$sage2" | sh;
# `npm test` failed; requires node-demux
# libswscale-dev required for node-demux
# imagemagick    required for SAGE2
sudo apt-get -y install libswscale-dev imagemagick;
cd sage2;
npm install node-demux;

################################################################################
# GitHub                                                                       #
################################################################################
cd "$home";
git clone https://github.com/Pretty-Cure-5/Euclidian.git;

################################################################################
# Decruftification                                                             #
################################################################################
cd "$home";
rm "$scala";
sudo apt-get -y autoremove;
sudo apt-get -y autoclean;

################################################################################
# Firewall                                                                     #
################################################################################
wget -O- 'https://github.com/Pretty-Cure-5/Euclidian/blob/master/Server/firewall.sh' | bash;

################################################################################
# Testification                                                                #
################################################################################
# Java 2>&1 | Head
printf '\ecShyam Has Your Anomaly Mitigated! :D\n\nINSTALLED:\n';
vim   --version | head -n 1;
git   --version;
printf 'NodeJS ';
node  --version;
printf 'NPM ';
npm   --version;
scala  -version;
java   -version  |& head -n 1;
javac  -version;

################################################################################
# You know nothing Jon Snow...until; it is known! :D                           #
################################################################################
printf '\nReboot, then check your firewall!\n\n';

