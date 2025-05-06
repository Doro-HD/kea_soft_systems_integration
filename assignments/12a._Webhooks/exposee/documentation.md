# 12a - Webhooks documentation
The project is hosted on [Cloudflare](https://kea-si-12a-webhook.sid-doro-hd.workers.dev), you should automatically be redirected to "/doc/ui" where the OpenAPI docs are displayed using Swagger.

## API
This project aims to emulate a dorm system that allows for webhooks. There are three types of resources, "users", "rooms" and "complaints". Each of these resources have their own endpoints where you can register webhooks using a post request. Note that these endpoints only allow for event kinds associated with the specified resource.

- /users/webhooks
- /rooms/webhooks
- /complaints/webhooks

There is also a generel webhook endponint that can be used to create a webhook with any type of event, again using a post request.

/webhooks

To trigger a set of webhooks, based on the resource, make a get request to one of the following endpoints, similar to before. We just attach "ping" to the path.

- /users/webhooks/ping
- /rooms/webhooks/ping
- /complaints/webhooks/ping

Or use the generel webhook endpoint to trigger every registered webhook

/webhooks/ping

I recommend that you refer to the open API documentation for details about the format of your requests. The documentation there is generated from the code and should therefore always be correct.