FROM verdaccio/verdaccio:5

# Copy your Verdaccio configuration file to the container
ADD ./verdaccio/conf /verdaccio/conf:z

# Change ownership of the directory without using sudo
USER root
RUN chown -R 100:101 /opt/verdaccio
RUN chmod -R 777 /verdaccio
USER $VERDACCIO_USER_UID
