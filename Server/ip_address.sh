#!/usr/bin/env bash
# This script rules in favour of an IP address.
#   ./ip_address.sh $ip_address

# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
ports=22,80,443,1337,9090,9292

sudo iptables -A INPUT  -p tcp -s $1/32 --match multiport --dports $ports -j ACCEPT
sudo iptables -A OUTPUT -p tcp -d $1/32 --match multiport --sports $ports -j ACCEPT
