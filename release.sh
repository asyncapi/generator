# note: can easily auto-bump version and release on pushes if needed - ask @treeder if wanted

version=$(docker run --rm -v $PWD:/app treeder/bump --extract --filename package.json)
echo "version $version"

docker tag asyncapi/generator:latest asyncapi/generator:$version
docker push asyncapi/generator:$version
docker push asyncapi/generator:latest
