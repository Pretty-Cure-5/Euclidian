#!/usr/bin/env bash
# [web-based interface]
# GitHub-NeCTAR Synchronisation

################################################################################
# Configuration                                                                #
################################################################################
read -r home < <(head -n 1 ./etc/home);
repo="$home"/Euclidian;
sage="$home"/sage2;
apps= ~/Documents/SAGE2_Media/apps/;

################################################################################
# Update Apps                                                                  #
################################################################################
cd "$repo";
git pull --all;
cp -r "$repo"/SAGE2/* "$apps";
# TODO: minimise JS/JSON files here; and the update.sh file.
