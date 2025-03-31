#!/bin/bash
MIGRATION_FILENAME="$1"
migrate create -ext sql -dir ../db/migrations "$MIGRATION_FILENAME" 
