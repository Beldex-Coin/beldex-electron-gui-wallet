FROM node:24-bullseye

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  ca-certificates \
  desktop-file-utils \
  fakeroot \
  file \
  git \
  libarchive-tools \
  libgtk-3-0 \
  libnotify4 \
  libnss3 \
  libopenjp2-7-dev \
  libopenjp2-tools \
  libxss1 \
  libxtst6 \
  python3 \
  rpm \
  xauth \
  xvfb \
  xz-utils \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /project