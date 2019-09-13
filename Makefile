
docker: 
	docker build -t asyncapi/generator:latest .

release:
	# todo: do this using CI
	./release.sh

.PHONY: docker release
