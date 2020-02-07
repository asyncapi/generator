.PHONY: docker
docker: 
	docker build -t derberg/generator:latest .

.PHONY: release
release:
	./release.sh
