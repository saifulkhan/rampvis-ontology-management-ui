# base image
FROM node:12.17.0

# install chrome for protractor tests
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir -p /usr/src/ui
WORKDIR /usr/src/ui

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/ui/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/ui/package.json
RUN npm install --force
# to avoid typescript version error
RUN npm install typescript@3.8.3
RUN npm install -g @angular/cli@9.1.7

# add app
COPY . /usr/src/ui

# start app
CMD ["ng","serve","--host", "0.0.0.0", "--disable-host-check"]

