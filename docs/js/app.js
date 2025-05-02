
    const schema = {
  "asyncapi": "3.0.0",
  "info": {
    "title": "Comments Service",
    "version": "1.0.0",
    "description": "This service is in charge of processing all the events related to comments."
  },
  "servers": {
    "dev": {
      "host": "test.mosquitto.org",
      "protocol": "mqtt"
    }
  },
  "channels": {
    "sendCommentLiked": {
      "address": "comment/liked",
      "messages": {
        "commentLiked": {
          "description": "Message that is being sent when a comment has been liked by someone.",
          "payload": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "commentId": {
                "type": "string",
                "x-parser-schema-id": "commentId"
              }
            },
            "x-parser-schema-id": "commentReaction"
          },
          "x-parser-unique-object-id": "commentLiked",
          "x-parser-message-name": "commentLiked"
        }
      },
      "description": "Updates the likes count in the database when new like is noticed.",
      "x-parser-unique-object-id": "sendCommentLiked"
    },
    "sendCommentUnliked": {
      "address": "comment/unliked",
      "messages": {
        "commentUnliked": {
          "description": "Message that is being sent when a comment has been unliked by someone.",
          "payload": "$ref:$.channels.sendCommentLiked.messages.commentLiked.payload",
          "x-parser-unique-object-id": "commentUnliked",
          "x-parser-message-name": "commentUnliked"
        }
      },
      "description": "Updates the likes count in the database when comment is unliked.",
      "x-parser-unique-object-id": "sendCommentUnliked"
    },
    "receiveCommentViews": {
      "address": "comment/views",
      "messages": {
        "commentViews": {
          "description": "Message that is being recived with the total number of views in a comment.",
          "payload": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "commentId": "$ref:$.channels.sendCommentLiked.messages.commentLiked.payload.properties.commentId"
            },
            "count": {
              "type": "integer",
              "x-parser-schema-id": "count"
            },
            "x-parser-schema-id": "commentCount"
          },
          "x-parser-unique-object-id": "commentViews",
          "x-parser-message-name": "commentViews"
        }
      },
      "description": "Gets the total number of comment views.",
      "x-parser-unique-object-id": "receiveCommentViews"
    }
  },
  "operations": {
    "sendCommentLiked": {
      "action": "send",
      "summary": "Message sent to the broker when a comment is liked",
      "channel": "$ref:$.channels.sendCommentLiked",
      "x-parser-unique-object-id": "sendCommentLiked"
    },
    "sendCommentUnliked": {
      "action": "send",
      "summary": "Message sent to the broker when a comment is unliked",
      "channel": "$ref:$.channels.sendCommentUnliked",
      "x-parser-unique-object-id": "sendCommentUnliked"
    },
    "receiveCommentViews": {
      "action": "receive",
      "summary": "Message received when a comment is viewed",
      "channel": "$ref:$.channels.receiveCommentViews",
      "x-parser-unique-object-id": "receiveCommentViews"
    }
  },
  "components": {
    "schemas": {
      "commentCount": "$ref:$.channels.receiveCommentViews.messages.commentViews.payload",
      "commentReaction": "$ref:$.channels.sendCommentLiked.messages.commentLiked.payload",
      "count": "$ref:$.channels.receiveCommentViews.messages.commentViews.payload.count",
      "commentId": "$ref:$.channels.sendCommentLiked.messages.commentLiked.payload.properties.commentId"
    }
  },
  "x-parser-spec-parsed": true,
  "x-parser-api-version": 3,
  "x-parser-spec-stringified": true
};
    const config = {"show":{"sidebar":true},"sidebar":{"showOperations":"byDefault"}};
    const appRoot = document.getElementById('root');
    AsyncApiStandalone.render(
        { schema, config, }, appRoot
    );
  