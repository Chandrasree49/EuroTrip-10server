const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());


const uri =
  "mongodb+srv://chandrasree097:cjZqh3U6PgklGqM7@cluster0.cwtzcv2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function startServer() {
  try {
   
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("addSpotDB");
    const spotCollection = database.collection("addSpot");

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    
    app.post("/addSpot", async (req, res) => {
      try {
        const {
          image,
          tourists_spot_name,
          country_Name,
          location,
          short_description,
          average_cost,
          seasonality,
          travel_time,
          totalVisitorsPerYear,
          userEmail,
          userName,
        } = req.body;

        const newSpot = {
          image,
          tourists_spot_name,
          country_Name,
          location,
          short_description,
          average_cost,
          seasonality,
          travel_time,
          totalVisitorsPerYear,
          user: {
            email: userEmail,
            name: userName,
          },
        };

        
       
   
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); 
  }
}

