# Account Service 1.0.0 documentation

This service is in charge of processing user signups

## Table of Contents

* [Operations](#operations)
  * [SUB user/signedup](#sub-usersignedup-operation)

## Operations

### SUB `user/signedup` Operation

#### Message `UserSignedUp`

##### Payload

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | object | - | - | - | **additional properties are allowed** |
| displayName | string | Name of the user | - | - | - |
| email | string | Email of the user | - | format (`email`) | - |

> Examples of payload _(generated)_

```json
{
  "displayName": "string",
  "email": "user@example.com"
}
```



