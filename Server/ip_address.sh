#!/usr/bin/env bash
<<DOC
This script rules in/out favour of an IP address.
    ./ip_address.sh $command $ip_address
$command
    A = mk
    D = rm
$ip_address
    IPv4
DOC

# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
ports=22,80,443,1337,9090,9292

sudo iptables -$1 INPUT  -p tcp -s $2/32 --match multiport --dports $ports -j ACCEPT
sudo iptables -$1 OUTPUT -p tcp -d $2/32 --match multiport --sports $ports -j ACCEPT
