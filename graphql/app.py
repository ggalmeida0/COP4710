from ariadne.asgi import GraphQL
from ariadne import gql, make_executable_schema
from resolvers import query, mutations
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


with open("schema.gql","r") as source:
    schemaSource = source.read()
    typeDefs = gql(schemaSource)
schema = make_executable_schema(typeDefs, [query,mutations])

middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'],allow_methods=['POST'])
]

app = Starlette(debug=True,middleware=middleware)
app.mount("/graphql", GraphQL(schema, debug=True))