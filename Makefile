DOCKER_USERNAME ?= astradzhao
APPLICATION_NAME ?= main-bff
 
build:
			docker build --tag ${DOCKER_USERNAME}/${APPLICATION_NAME} .

push:
			docker push ${DOCKER_USERNAME}/${APPLICATION_NAME}

run:
			docker run -p 8080:8080 -d ${DOCKER_USERNAME}/${APPLICATION_NAME}

stop:
			docker stop $(shell docker ps -q --filter ancestor=${DOCKER_USERNAME}/${APPLICATION_NAME} )

dev:
			docker-compose up --build

start:
			docker-compose up --build -d