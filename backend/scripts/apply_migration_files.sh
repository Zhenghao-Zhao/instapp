#!/bin/bash
migrate -database ${INSTAPP_DB} -path ../db/migrations up
