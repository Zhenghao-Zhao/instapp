FROM golang:1.23.0 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

RUN go install github.com/cespare/reflex@latest

COPY . .

FROM golang:1.23.0

WORKDIR /app

COPY --from=builder /go/bin/reflex /go/bin/reflex

COPY --from=builder /app .

EXPOSE 5001

CMD ["reflex", "-r", "\\.go$", "-s", "--", "sh", "-c", "go run main.go"]
