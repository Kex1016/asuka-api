#!/bin/bash

API_SECRET="X2XZA3qbRHhc"
#AUTH_HEADER=$(echo -n $API_SECRET | sha256sum | awk '{print $1}')
AUTH_HEADER=tUPptDNmMDVgarMdTVLB7BYB7onxDuOn8tEKnjTwvCqjaGOrcFQmjOO1aH9nq3iD
URL="https://safe.haiiro.moe/api/link/create"

METHOD="POST"

curl --request $METHOD -sL \
    --header "apiKey: $AUTH_HEADER" \
    --header "Content-Type: application/json" \
    --url "${URL}" \

