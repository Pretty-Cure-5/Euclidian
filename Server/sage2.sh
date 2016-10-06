#!/usr/bin/env bash

#sage2.sh 2 1 1920 1080 003366 255,0,0,0.5
#sage2.sh cols rows width height hex/bg rgba/fg

################################################################################
# Configuration                                                                #
################################################################################
home=/home/ubuntu;
sage="$home"/sage2;
conf="$sage"/config;
platform=Ubuntu;
application=Euclidian;
server=localhost;
configuration=pc5;
#cat>server<<<43.240.97.247;
##server=43.240.97.247;
###server="$(cat ./server)";

# which ffmpeg;
ffmpeg=/usr/bin/ffmpeg;
# locate imagemagick ImageMagick;
imagemagick='';

################################################################################
# Drop SAGE2                                                                   #
################################################################################
killall npm #node
kill -9 "$(ps x | awk '/node server\.js -li/{print $1}')";

################################################################################
# Install config.txt                                                           #                                                                   #
################################################################################
cat>"$sage"/config.txt<<<"$conf"/"$configuration"-cfg.json;

################################################################################
# Generate -cfg.json file                                                      #
################################################################################
cols=$1;
rows=$2;
width=$3;
height=$4;
hex=$5;
rgba=$6;
displays=$((rows*cols));
cfg="/*
    $application configuration of the server - $platform
*/
{
    name:\"$application\"
    , host:\"$server\"
    , port: 9090
    , index_port: 9292
    , background:{color:\"#$hex\",watermark:{svg:\"images/sage2.svg\",color:\"rgba($rgba)\"}}
    , audio: {
        initialVolume: 8,
    }
    , ui: {
        clock: 12
        , show_version: true
        , show_url: true
        , maxWindowWidth: 8192
        , maxWindowHeight: 8192
        , noDropShadow: true
    }
    , resolution:{width:$width,height:$height}
    , layout:{rows:$rows,columns:$cols}
    , displays:[";
for((y=0;y<rows;y++)); do for((x=0;x<cols;x++)); do
    cfg="$cfg$(printf '{column:%d,row:%d}\n' $x $y)";
    if((!(x==cols-1&&y==rows-1))); then cfg="$cfg$(printf ',')"; fi;
done; done;
cfg="$cfg]
    , alternate_hosts: [
        \"localhost\"
        , \"127.0.0.1\"
    ]
    , remote_sites: []
    , dependencies:{FFMpeg:\"$ffmpeg\"}
}";
#    , dependencies:{FFMpeg:"$ffmpeg",ImageMagick:"$imagemagick"}

cat>"$conf"/"$configuration"-cfg.json<<<"$cfg";

################################################################################
# Raise SAGE2 back from the dead                                               #
################################################################################
cd "$sage";
nohup node server.js -li &
