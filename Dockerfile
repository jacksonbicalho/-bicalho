ARG DOCKER_WORK_DIR_DEFAULT=/usr/src/app
ARG NODE_VERSION=18.18.2
ARG YARN_VERSION=1.22.19


# #############################
# # base: build for Base
# #############################
FROM node:${NODE_VERSION}-alpine As base

LABEL package=bicalho

ARG DOCKER_LABEL_KEY
ENV DOCKER_LABEL_KEY ${DOCKER_LABEL_KEY}

ARG DOCKER_LABEL_VALUE
ENV DOCKER_LABEL_VALUE ${DOCKER_LABEL_VALUE}

LABEL ${DOCKER_LABEL_KEY}=${DOCKER_LABEL_VALUE}

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-builder}

ARG DOCKER_USER_UID
ENV DOCKER_USER_UID ${DOCKER_USER_UID:-36891}

ARG DOCKER_USER_NAME ${DOCKER_USER_NAME}
ENV DOCKER_USER_NAME ${DOCKER_USER_NAME}

ARG NPM_TOKEN ${NPM_TOKEN}
ENV NPM_TOKEN ${NPM_TOKEN}

ARG YARN_TOKEN ${YARN_TOKEN}
ENV YARN_TOKEN ${YARN_TOKEN}

ARG DOCKER_WORK_DIR
ENV DOCKER_WORK_DIR ${DOCKER_WORK_DIR:-$DOCKER_WORK_DIR_DEFAULT}

COPY \
  package.json* \
  yarn.lock* \
  .yarnrc* \
  .npmrc* \
  ./

RUN rm -rf ./cache

RUN rm -rf /usr/local/bin/yarn \
  && rm -rf /usr/local/bin/yarnpkg \
  && npm uninstall --loglevel warn --global pnpm \
  # && npm uninstall --loglevel warn --global npm \
  && deluser --remove-home node \
  && apk --no-cache update \
  && apk --no-cache upgrade \
  && apk add --no-cache \
  openssh \
  bash \
  make \
  python3 \
  curl \
  git \
  && apk add --no-cache \
  --virtual builds-deps \
  && curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" \
  && tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn \
  && ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg \
  && rm yarn-v$YARN_VERSION.tar.gz \
  && yarn --version \
  && curl -sfL RUN curl -sf https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin/ \
  && apk del builds-deps \
  && rm -rf /var/cache/apk/*

RUN mkdir -p /etc/skel/

RUN <<EOF cat >> /etc/skel/.bashrc
 set autologout = 30
 set prompt = "$ "
 set history = 0
 set ignoreeof
EOF
RUN cp /etc/skel/.bashrc /etc/skel/.profile

RUN addgroup -S ${DOCKER_USER_NAME} -g ${DOCKER_USER_UID} \
  && adduser -S -G ${DOCKER_USER_NAME} -u ${DOCKER_USER_UID} ${DOCKER_USER_NAME} \
 --shell /bin/bash \
 --home /home/${DOCKER_USER_NAME} \
 -k /etc/skel \
 && mkdir /home/${DOCKER_USER_NAME}/.ssh

WORKDIR ${DOCKER_WORK_DIR}

COPY . ./

COPY ./docker/*.sh /usr/local/bin/
RUN chmod -R +x /usr/local/bin/

RUN if [ "$TARGET" != "publish" ]; then install-dependencies.sh; fi;

RUN ls -l \
  && ls /usr/local/bin/ \
  && /usr/local/bin/node-prune \
  && chown -R ${DOCKER_USER_NAME}:${DOCKER_USER_NAME} ./

ARG GIT_CONFIG_USER_NAME ${GIT_CONFIG_USER_NAME}
ENV GIT_CONFIG_USER_NAME ${GIT_CONFIG_USER_NAME}

ARG GIT_CONFIG_USER_EMAIL ${GIT_CONFIG_USER_EMAIL}
ENV GIT_CONFIG_USER_EMAIL ${GIT_CONFIG_USER_EMAIL}


RUN --mount=type=secret,id=npmrc,target=${DOCKER_WORK_DIR}/.npmrc
RUN --mount=type=secret,id=ssh_github,target=/home/${DOCKER_USER_NAME}/.ssh/github

ENV NODE_REPL_HISTORY=''

RUN echo $(./scripts/ssh-key.sh) >> /home/${DOCKER_USER_NAME}/.ssh/github

# RUN eval $(ssh-agent -s)
# RUN ssh-add /home/${DOCKER_USER_NAME}/.ssh/github


USER ${DOCKER_USER_NAME}

RUN git config --global user.name "${GIT_CONFIG_USER_NAME}" \
  && git config --global user.email "${GIT_CONFIG_USER_EMAIL}"



ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node" ]


#####################################
# development
#####################################
FROM base as dev
ARG DOCKER_LABEL_KEY
ARG DOCKER_LABEL_VALUE
ENV DOCKER_LABEL_KEY ${DOCKER_LABEL_KEY}
ENV DOCKER_LABEL_VALUE ${DOCKER_LABEL_VALUE}
LABEL ${DOCKER_LABEL_KEY}=${DOCKER_LABEL_VALUE}

ENV NODE_ENV=development

ARG SERVER_PORT
ENV SERVER_PORT ${SERVER_PORT}


ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

ARG YARN_TOKEN
ENV YARN_TOKEN ${YARN_TOKEN}

EXPOSE ${SERVER_PORT}

CMD [ "node" ]

##################################
# publish
##################################
FROM base as publish
ARG DOCKER_LABEL_KEY
ENV DOCKER_LABEL_KEY ${DOCKER_LABEL_KEY}

ARG DOCKER_LABEL_VALUE
ENV DOCKER_LABEL_VALUE ${DOCKER_LABEL_VALUE}

LABEL ${DOCKER_LABEL_KEY}=${DOCKER_LABEL_VALUE}

ENV NODE_ENV=development

ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

ARG YARN_TOKEN
ENV YARN_TOKEN ${YARN_TOKEN}

COPY --from=base --chown=${DOCKER_USER_NAME}:${DOCKER_USER_NAME} /app/package.json /app/package.json
COPY --from=base --chown=${DOCKER_USER_NAME}:${DOCKER_USER_NAME} /app/yarn.lock /app/yarn.lock


