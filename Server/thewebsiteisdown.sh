#!/usr/bin/env bash
# [script-based interface]

killall npm; #node;
kill -9 "$(ps x | awk '/node server\.js -li/{print $1}')";

exit 0;
