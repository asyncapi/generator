.PHONY: docker
docker: 
	docker build -t asyncapi/generator:latest .

.PHONY: release
release:
	./release.sh
