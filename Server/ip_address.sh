#!/usr/bin/env bash
# This script rules in favour of an IP address.
#   ./ip_address.sh $ip_address

sudo iptables -A INPUT  -p tcp -s $1/32 --match multiport --dports $ports -j ACCEPT
sudo iptables -A OUTPUT -p tcp -d $1/32 -j ACCEPT
