#!/usr/bin/env bash
# [script-based interface]

read -r home < <(head -n 1 ./etc/home);
sage="$home"/sage2;

cd "$sage";
nohup node server.js -li &

exit 0;
