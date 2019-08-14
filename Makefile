docker: 
	docker build -t asyncapi/generator:latest .

push: docker
	# todo: version and auto push these using CI
	docker push asyncapi/generator:latest

.PHONY: docker push
