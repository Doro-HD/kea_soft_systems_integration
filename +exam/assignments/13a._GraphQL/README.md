# 13a - GraphQL
GraphQL was created by then Facebook, now Meta, to enhance the performance of their mobile app as it was performming poorly on the worse hardware of the IPhone.

## Project structure
For this project I wanted to go with Hono, but they do not provide a GraphQL solution, instead they recommend using [Pylon](https://pylon.cronit.io) which is built ontop of Hono.

Pylon is a code first GraphQL solution, that makes it incredible easy to create a GraphQL api that can run on multiple runtimes. In this case its running in a cloudflare environment.