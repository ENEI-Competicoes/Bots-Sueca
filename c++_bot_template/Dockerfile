FROM gcc:latest

WORKDIR /app

COPY . .

RUN g++ main.cpp communicator.cpp -o main -lcurl

CMD ["./main"]
