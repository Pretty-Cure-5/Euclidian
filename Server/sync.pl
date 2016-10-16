#!/usr/bin/perl
# [web-based interface]
# This PL script compacts JS/JSON files as it synchronises GH-SAGE2.

################################################################################
# SOOTB-ly modular.                                                            #
################################################################################
use v5.22.1;
use strict;
use warnings;

################################################################################
# CPAN modules.                                                                #
################################################################################
use JavaScript::Minifier qw(minify);

################################################################################
# Variables.                                                                   #
################################################################################
open my $file, '<', './etc/home' or die;
my $home = <$file>;
close $file or die;
my $repo = "$home/Euclidian";
my $apps = "$repo/SAGE2";
my $sage = "$home/Documents/SAGE2_Media/apps";

################################################################################
# Drop SAGE2                                                                   #
################################################################################
print `./thewebsiteisdown.sh;`;

################################################################################
# GitHub-NeCTAR synchronisation.                                               #
################################################################################
#print "Synchronising the local repository...\n";
print `command cd \Q$repo\E; /usr/bin/git pull --all;`;

################################################################################
# Remove SAGE2 apps.                                                           #
################################################################################
#print "Removing $sage...\n";
print `/bin/rm -rf \Q$sage\E;`;

################################################################################
# Compact and copy GH apps into SAGE2 apps.                                    #
################################################################################
#print "Compacting/copying Git\@SAGE2...\n" . '%'x80 . "\n";
foreach my $file(split /\n/, `/usr/bin/find \Q$apps\E;`) {
    if(-d $file) { # mkdir namespace
        $file =~ s/^\Q$apps/$sage/;
#        print "mkdir  $file\n";
        mkdir $file, 0775;
    } else { # cp script.min.js* SAGE2
        my $min = $file =~ s/^\Q$apps/$sage/r;
        open my $in , '<', $file or die "err_in: $file\n";
        open my $out, '>', $min  or die "err_out: $min\n";
        if($file !~ /^.+\/shared\/dat\/.+$/ && $file =~ /^.+\.js(on)?$/) {
#            print "minify $file\n";
            minify input => $in, outfile => $out;
        } else {
#            print "copy   $file\n";
            while(<$in>) {print $out $_;}
        }
        close $in or die;
        close $out or die;
    }
}
#print '^'x80 . "\n";

################################################################################
# Raise SAGE2 back from the dead                                               #
################################################################################
print `./thewebsiteisup.sh;`;

################################################################################
# Escape sequence.                                                             #
################################################################################
exit 0;
