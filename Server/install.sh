#!/usr/bin/env bash
# Post-installation script for Ubuntu/NeCTAR.
# (This should work, but I haven't tested it.)

################################################################################
# Configuration                                                                #
################################################################################
home=/home/ubuntu/
# http://www.scala-lang.org/download/
scala=scala-2.11.8.deb

################################################################################
# Update Server                                                                #
################################################################################
sudo apt-get update
sudo apt-get dist-upgrade
sudo apt-get autoremove
sudo apt-get autoclean

################################################################################
# GitHub
################################################################################
cd "$home"
sudo apt-get install git
git clone https://github.com/Pretty-Cure-5/Euclidian.git

################################################################################
# SAGE2 via Ian Peake (and maybe Ed?)
################################################################################
cd "$home"
wget https://bitbucket.org/sage2/sage2/downloads/SAGE2ubuntu.sh
sh SAGE2ubuntu.sh
rm SAGE2ubuntu.sh
sudo apt-get install libav-dev
cd sage2
npm run in
sudo apt-get install libswscale-dev
npm install node-demux
sudo apt-get install imagemagick
chmod -R a+rX ~

################################################################################
# Java [http://openjdk.java.net/install/]                                      #
################################################################################
sudo apt-get install openjdk-8-jre openjdk-8-jdk

################################################################################
# Scala [http://www.scala-lang.org/download/]                                  #
################################################################################
cd "$home"
wget "http://scala-lang.org/files/archive/$scala"
sudo dpkg -i "$scala"
sudo apt-get update
sudo apt-get install scala
rm "$scala"

################################################################################
# Extras                                                                       #
################################################################################
sudo apt-get install vim
