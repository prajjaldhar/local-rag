import { QdrantClient } from "@qdrant/js-client-rest";
import { getEmbedding } from "./embed.js";

const client = new QdrantClient({
  host: "localhost",
  port: 6333,
});

export async function search(query) {
  const queryVector = await getEmbedding(query);

  const results = await client.search("documents", {
    vector: queryVector,
    limit: 3,
  });

  console.log(results);
}
