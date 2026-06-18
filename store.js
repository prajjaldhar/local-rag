import { QdrantClient } from "@qdrant/js-client-rest";

import fs from "fs";
import { getEmbedding } from "./embed.js";

const client = new QdrantClient({
  host: "localhost",
  port: 6333,
});

export async function createCollection() {
  try {
    const collections = await client.getCollections();

    const exists = collections.collections.some((c) => c.name === "documents");

    if (exists) {
      console.log("Collection already exists");
      return;
    }

    await client.createCollection("documents", {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log("Collection Created");
  } catch (error) {
    console.error("Failed to create collection:", error.message);
  }
}

// const collections = await client.getCollections();

// console.log(collections);

// const info = await client.getCollection("documents");

// console.log(info);

// const points = await client.scroll("documents", {
//   limit: 10,
//   with_payload: true,
//   with_vector: false,
// });

// console.log(points);
export async function uploadDocuments() {
  const docs = JSON.parse(fs.readFileSync("./data/data.json", "utf-8"));

  const points = await Promise.all(
    docs.map(async (doc) => {
      const vector = await getEmbedding(doc.text);

      return {
        id: doc.id,
        vector,
        payload: {
          title: doc.title,
          category: doc.category,
          author: doc.author,
          text: doc.text,
        },
      };
    }),
  );

  await client.upsert("documents", {
    wait: true,
    points,
  });

  console.log("Documents Stored");
}
