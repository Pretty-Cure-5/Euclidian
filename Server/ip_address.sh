#!/usr/bin/env bash
# [web-based interface]
# [admin-based interface]
# Firewall Invitations

<<DOC
This script rules in/out favour of an IP address.
    ./ip_address.sh $command $ip_address
$command
    A = Add = mk
    D = Del = rm
$ip_address
    IPv4
DOC

# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
read -r ports < <(head -n 1 ./etc/loopholes);

sudo iptables -$1 INPUT  -p tcp -s $2/32 --match multiport --dports $ports -j ACCEPT
sudo iptables -$1 OUTPUT -p tcp -d $2/32 --match multiport --sports $ports -j ACCEPT
