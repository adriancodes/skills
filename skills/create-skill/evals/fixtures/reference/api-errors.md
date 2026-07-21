# Authentication Errors

- `E_AUTH_17`: the calling service credential has expired. Rotate the service credential and retry the service-to-service request. Do not sign out an end user.
- `E_AUTH_18`: the end-user session has expired. Ask the user to authenticate again. Do not rotate service credentials.
- `E_AUTH_19`: the credential is valid but lacks the requested scope. Request the missing scope; refreshing or rotating the credential cannot add authorization.
