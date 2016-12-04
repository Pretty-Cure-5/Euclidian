#!/usr/bin/env bash
# [admin-based interface]
# Post-installation script for NeCTAR Ubuntu 16.04 LTS (Xenial) amd64.

# cat IP addresses into ~/phonebook and ~/server before running
# $ wget -O- 'https://raw.githubusercontent.com/Pretty-Cure-5/Euclidian/master/Server/install.sh' | bash;

################################################################################
# Configuration                                                                #
################################################################################
#home=/home/ubuntu
github=https://raw.githubusercontent.com
read -r home < <(
    wget -O- "$github"/Pretty-Cure-5/Euclidian/master/Server/etc/home
);
server="$home"/Euclidian/Server/
project=https://github.com/Pretty-Cure-5/Euclidian.git
# https://bitbucket.org/sage2/sage2/wiki/
sage2=https://bitbucket.org/sage2/sage2/downloads/SAGE2ubuntu.sh;
# http://openjdk.java.net/install/
jre=openjdk-8-jre;
jdk=openjdk-8-jdk;
# http://www.scala-lang.org/download/
scala=scala-2.11.8.deb;

################################################################################
# Human required!                                                              #
################################################################################
sleep 1;
printf \\ec;
# This just gets ignored; WHY?!?
read -rp 'Have you got a ~/phonebook and a ~/server? [y/n] ' response </dev/tty;
# Self-interfacing scripts!!! :D
response=${response,,}; # case insensitivity
if [[ $response =~ ^(no|n)$ ]]; then # RTFM
    printf '\nWell, what are you waiting for; an invitation?!?\n\n';
    exit 1;
fi;
# Bloody asynchronous handling!?!
printf '\nI assume you know what you are doing...\n';
sleep 2;
# This is where it kicks off after wget has finally died.
printf '\nHere, before you go; take care of this...\n';
sleep 2;
printf '\n';
yes | sudo apt-get -y install --force-yes iptables-persistent;
printf '\nYou are no longer required; this will take a long time...\n';
sleep 5;
printf '\n';

################################################################################
# Update Server                                                                #
################################################################################
sudo apt-get -y update;
# OMG WTF FFS!!!
sudo apt-get dist-upgrade;

################################################################################
# Install Packages                                                             #
################################################################################
sudo add-apt-repository -y ppa:openjdk-r/ppa
sudo apt-get -y update;
# SAGE2ubuntu.sh installs git
yes | sudo apt-get -y install --force-yes\
    `#iptables-persistent`\
    "$jre"\
    "$jdk"\
    `#git`\
    make\
    vim;
# Fucking iptables-persistent!!!
# I may have to move iptables-persistent to the very front of the line...

################################################################################
# Install Perl Modules                                                         #
################################################################################
# http://search.cpan.org/search?query=JavaScript+Minifier&mode=all
# http://search.cpan.org/~zoffix/JavaScript-Minifier-1.14/lib/JavaScript/Minifier.pm
cpan=http://search.cpan.org;
module=JavaScript-Minifier-1.14;
tarball="$module".tar.gz;
cd "$home";
wget "$cpan"/CPAN/authors/id/Z/ZO/ZOFFIX/"$tarball";
tar -zxvf "$tarball";
cd "$module";
perl Makefile.PL;
make;
#make test;
sudo make install;
cd "$home";
sudo rm -rf "$module"*;

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
# `npm test` failed; requires node-demux
# libswscale-dev required for node-demux
# imagemagick    required for SAGE2
sudo apt-get -y install libswscale-dev imagemagick;
mkdir sage2;
cd sage2;
npm install node-demux;
cd "$home";
wget -O- "$sage2" | sed 's/npm install/npm install --verbose/' | sh;
cd sage2;
npm install node-demux;

################################################################################
# GitHub                                                                       #
################################################################################
cd "$home";
git clone "$project";

################################################################################
# Firewall                                                                     #
################################################################################
cd "$server";
./firewall.sh

################################################################################
# Decruftification                                                             #
################################################################################
cd "$home";
rm "$scala";
sudo apt-get -y autoremove;
sudo apt-get -y autoclean;

################################################################################
# Testification                                                                #
################################################################################
# Java 2>&1 | Head
printf '\ecShyam Has Your Anomaly Mitigated! :D\n\nINSTALLED:\n';
vim   --version |  head -n 1;
git   --version ;
printf 'NodeJS ';
node  --version ;
printf 'NPM '   ;
npm   --version ;
scala  -version ;
scalac -version ;
java   -version |& head -n 1;
javac  -version ;

################################################################################
# You know nothing Jon Snow...until; it is known! :D                           #
################################################################################
printf '\nReboot, then check your firewall!\n\n';
