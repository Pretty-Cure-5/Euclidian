#!/usr/bin/env bash
# [install-based interface]
# Using iptables instead of NeCTAR's unconventional interface

################################################################################
# Configuration                                                                #
################################################################################
read -r home  < <(head -n 1 ./etc/home);
read -r port  < <(head -n 1 ./etc/port);
read -r ports < <(head -n 1 ./etc/loopholes);
phonebook="$home"/phonebook;

################################################################################
# Defenestration                                                               #
################################################################################
sudo ip6tables -F;
sudo ip6tables -X;
sudo iptables  -F;
sudo iptables  -X;

################################################################################
# Conflagration                                                                #
################################################################################
sudo ip6tables -P INPUT   DROP;
sudo ip6tables -P OUTPUT  DROP;
sudo ip6tables -P FORWARD DROP;
sudo iptables  -P INPUT   DROP;
sudo iptables  -P OUTPUT  DROP;
sudo iptables  -P FORWARD DROP;

################################################################################
# Stingers                                                                     #
################################################################################
sudo ip6tables -A INPUT   -m state --state INVALID -j REJECT;
sudo ip6tables -A FORWARD -m state --state INVALID -j REJECT;
sudo ip6tables -A OUTPUT  -m state --state INVALID -j REJECT;
sudo iptables  -A INPUT   -m state --state INVALID -j REJECT;
sudo iptables  -A FORWARD -m state --state INVALID -j REJECT;
sudo iptables  -A OUTPUT  -m state --state INVALID -j REJECT;
sudo iptables  -A INPUT   -f -j REJECT;
sudo iptables  -A FORWARD -f -j REJECT;
sudo iptables  -A OUTPUT  -f -j REJECT;

################################################################################
# Ping *quack-bzz-quack-quack-quack-quack-quack-quack-quack-quack*             #
################################################################################
# http://www.cyberciti.biz/tips/linux-iptables-9-allow-icmp-ping.html
sudo ip6tables -A INPUT  -p icmpv6 --icmpv6-type echo-request -j ACCEPT;
sudo ip6tables -A OUTPUT -p icmpv6 --icmpv6-type echo-reply   -j ACCEPT;
sudo ip6tables -A OUTPUT -p icmpv6 --icmpv6-type echo-request -j ACCEPT;
sudo ip6tables -A INPUT  -p icmpv6 --icmpv6-type echo-reply   -j ACCEPT;
sudo iptables  -A INPUT  -p icmp   --icmp-type   echo-request -j ACCEPT;
sudo iptables  -A OUTPUT -p icmp   --icmp-type   echo-reply   -j ACCEPT;
sudo iptables  -A OUTPUT -p icmp   --icmp-type   echo-request -j ACCEPT;
sudo iptables  -A INPUT  -p icmp   --icmp-type   echo-reply   -j ACCEPT;

################################################################################
# Octocat                                                                      #
################################################################################
# https://help.github.com/articles/what-ip-addresses-does-github-use-that-i-should-whitelist/
sudo iptables -A INPUT  -p tcp -s 192.30.252.0/22 --match multiport --sports 22,80,443,9418 -j ACCEPT;
sudo iptables -A OUTPUT -p tcp -d 192.30.252.0/22 --match multiport --dports 22,80,443,9418 -j ACCEPT;

################################################################################
# DNS                                                                          #
################################################################################
#cat /etc/resolv.conf
dns='43.240.99.250 8.8.8.8 43.240.99.251';
for each in $dns; do
    sudo iptables -A INPUT  -p udp -s $each --sport 53 -j ACCEPT;
    sudo iptables -A OUTPUT -p udp -d $each --dport 53 -j ACCEPT;
    sudo iptables -A INPUT  -p tcp -s $each --sport 53 -j ACCEPT;
    sudo iptables -A OUTPUT -p tcp -d $each --dport 53 -j ACCEPT;
done;

################################################################################
# Localhost                                                                    #
################################################################################
sudo iptables -A INPUT  -i lo -j ACCEPT;
sudo iptables -A OUTPUT -o lo -j ACCEPT;

################################################################################
# Personal invitations                                                         #
################################################################################
while read address; do
    sudo iptables -A INPUT  -p tcp -s $address/32 --match multiport --dports $ports,$port -j ACCEPT;
    sudo iptables -A OUTPUT -p tcp -d $address/32 --match multiport --sports $ports,$port -j ACCEPT;
done <"$phonebook";

################################################################################
# Ruling sustained!                                                            #
################################################################################
sudo bash -c "ip6tables-save >/etc/iptables/rules.v6";
sudo bash -c "iptables-save  >/etc/iptables/rules.v4";
