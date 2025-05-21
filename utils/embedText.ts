import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAi from "openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
	ASTRA_DB_KEYSPACE,
	ASTRA_DB_COLLECTION,
	ASTRA_DB_API_ENDPOINT,
	ASTRA_DB_APPLICATION_TOKEN,
	OPENAI_API_KEY,
} = process.env;

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT!, { keyspace: ASTRA_DB_KEYSPACE });

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 512,
	chunkOverlap: 100,
});

export async function createCollection (
	similarityMetric: SimilarityMetric = "dot_product"
) {
	const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
		vector: {
			dimension: 1536,
			metric: similarityMetric,
		},
	});

	console.log(res);
};

export async function loadSampleData (content: string) {
	const collection = await db.collection(ASTRA_DB_COLLECTION!);

	const chunks = await splitter.splitText(content);
    
	for await (const chunk of chunks) {
		const embedding = await openai.embeddings.create({
			model: "text-embedding-3-small",
			input: chunk,
			encoding_format: "float",
		});
		const res = await collection.insertOne({
			$vector: embedding.data[0].embedding,
			text: chunk,
		});
		console.log(res);
	}
	
};