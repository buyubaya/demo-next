#!/usr/bin/env bash

function main() {
    declare -A -x command_table=(
        ['scan-files']="scan_large_files" 
        ['process-logs']="process_logs"
        ['get-photo']="get_nasa_photo"
    )

}