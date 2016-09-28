#!/usr/bin/env bash
# Using iptables instead of NeCTAR's unconventional interface.

phonebook=/home/ubuntu/phonebook
# https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
ports=22,80,443,1337,9090,9292

ip6tables -P INPUT   ACCEPT;
ip6tables -P OUTPUT  ACCEPT;
ip6tables -P FORWARD ACCEPT;
iptables  -P INPUT   ACCEPT;
iptables  -P OUTPUT  ACCEPT;
iptables  -P FORWARD ACCEPT;
# Defenestration.
ip6tables -F;
ip6tables -X;
iptables  -F;
iptables  -X;

# Conflagration.
ip6tables -P INPUT   DROP;
ip6tables -P OUTPUT  DROP;
ip6tables -P FORWARD DROP;
iptables  -P INPUT   DROP;
iptables  -P OUTPUT  DROP;
iptables  -P FORWARD DROP;

# Stingers.
ip6tables -A INPUT   -m state --state INVALID -j REJECT;
ip6tables -A FORWARD -m state --state INVALID -j REJECT;
ip6tables -A OUTPUT  -m state --state INVALID -j REJECT;
iptables  -A INPUT   -m state --state INVALID -j REJECT;
iptables  -A FORWARD -m state --state INVALID -j REJECT;
iptables  -A OUTPUT  -m state --state INVALID -j REJECT;
iptables  -A INPUT   -f -j REJECT;
iptables  -A FORWARD -f -j REJECT;
iptables  -A OUTPUT  -f -j REJECT;

# Ping. *quack-bzz-quack-quack-quack-quack-quack-quack-quack-quack*
# http://www.cyberciti.biz/tips/linux-iptables-9-allow-icmp-ping.html
ip6tables -A INPUT  -p icmpv6 --icmpv6-type echo-request -j ACCEPT
ip6tables -A OUTPUT -p icmpv6 --icmpv6-type echo-reply   -j ACCEPT
ip6tables -A OUTPUT -p icmpv6 --icmpv6-type echo-request -j ACCEPT
ip6tables -A INPUT  -p icmpv6 --icmpv6-type echo-reply   -j ACCEPT
iptables  -A INPUT  -p icmp   --icmp-type   echo-request -j ACCEPT
iptables  -A OUTPUT -p icmp   --icmp-type   echo-reply   -j ACCEPT
iptables  -A OUTPUT -p icmp   --icmp-type   echo-request -j ACCEPT
iptables  -A INPUT  -p icmp   --icmp-type   echo-reply   -j ACCEPT

# Personal invitations.
while read address; do
    iptables -A INPUT  -p tcp -s $address/32 --match multiport --dports $ports -j ACCEPT
    iptables -A OUTPUT -p tcp -d $address/32 -j ACCEPT
done <$phonebook

# Ruling sustained!
ip6tables-save >/etc/iptables/rules.v6;
iptables-save  >/etc/iptables/rules.v4;
