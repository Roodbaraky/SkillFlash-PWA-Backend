import { MongoClient, Db } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});


const uri = process.env.URI as string;

let client: MongoClient | null = null;
let database: Db | null = null;


const connectDB = async (): Promise<Db> => {
	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
		console.log("MongoDB connected successfully");
	}
	if (!database) {
		const ENV = process.env.NODE_ENV || "development";
		const databaseString =
			ENV === "development" ? "skillflash" : "skillflash_test";
		database = client.db(databaseString);
	}
	return database;
};

const disconnectDB = async (): Promise<void> => {
	if (client) {
		await client.close();
		client = null;
		database = null;
		console.log("MongoDB disconnected successfully");
	}
};
const getDb = (): Db => {
	connectDB();
	if (!database) {
		throw new Error("Database not connected. Call connectDB() first.");
	}
	return database;
};

export { connectDB, getDb, disconnectDB };