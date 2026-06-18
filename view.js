import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  host: "localhost",
  port: 6333,
});

const data = await client.scroll("documents", {
  limit: 100,
  with_payload: true,
  with_vector: false,
});

const collections = await client.getCollections();

console.log(collections);

const info = await client.getCollection("documents");

console.log(info);

console.log(JSON.stringify(data, null, 2));

const result = await client.scroll("documents", {
  limit: 10,
  with_payload: true,
  with_vector: true,
});

console.log(JSON.stringify(result, null, 2));
