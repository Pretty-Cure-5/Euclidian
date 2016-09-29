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

# Octocat.
# https://help.github.com/articles/what-ip-addresses-does-github-use-that-i-should-whitelist/
iptables -A INPUT  -p tcp -s 192.30.252.0/22 --match multiport --sports 22,80,443,9418 -j ACCEPT
iptables -A OUTPUT -p tcp -d 192.30.252.0/22 --match multiport --dports 22,80,443,9418 -j ACCEPT

# DNS.
dns='43.240.99.250 8.8.8.8 43.240.99.251'
for each in $dns; do
    iptables -A INPUT  -p udp -s "$each" --sport 53 -j ACCEPT
    iptables -A OUTPUT -p udp -d "$each" --dport 53 -j ACCEPT
    iptables -A INPUT  -p tcp -s "$each" --sport 53 -j ACCEPT
    iptables -A OUTPUT -p tcp -d "$each" --dport 53 -j ACCEPT
done

# Localhost.
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Personal invitations.
while read address; do
    iptables -A INPUT  -p tcp -s $address/32 --match multiport --dports $ports -j ACCEPT
    iptables -A OUTPUT -p tcp -d $address/32 --match multiport --sports $ports -j ACCEPT
done <$phonebook

# Ruling sustained!
ip6tables-save >/etc/iptables/rules.v6;
iptables-save  >/etc/iptables/rules.v4;
