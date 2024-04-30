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
    const CcountriesCollection = database.collection("countries");

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

       

        const result = await spotCollection.insertOne(newSpot);
        res.status(201).json({ message: "Spot added successfully", data: "" });
      } catch (error) {
        console.error("Error adding spot:", error);
        res.status(500).json({ message: error });
      }
    });

    app.put("/updateSpot/:id", async (req, res) => {
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
        const spotId = req.params.id;

        const updateData = {
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

        const result = await spotCollection.updateOne(
          { _id: new ObjectId(spotId) },
          { $set: updateData }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Spot not found" });
        }

        res
          .status(200)
          .json({ message: "Spot updated successfully", data: "" });
      } catch (error) {
        console.error("Error updating spot:", error);
        res.status(500).json({ message: error });
      }
    });

    app.delete("/deleteSpot/:id", async (req, res) => {
      try {
        const spotId = req.params.id;

        const result = await spotCollection.deleteOne({
          _id: new ObjectId(spotId),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Spot not found" });
        }

        res.status(200).json({ message: "Spot deleted successfully" });
      } catch (error) {
        console.error("Error deleting spot:", error);
        res.status(500).json({ message: error });
      }
    });

    app.get("/spots", async (req, res) => {
      try {
        const spots = await spotCollection.find({}).toArray();
        res.status(200).json(spots);
      } catch (error) {
        console.error("Error retrieving spots:", error);
        res.status(500).json({ message: error });
      }
    });

    app.get("/spotsbycountry", async (req, res) => {
      try {
        const countryName = req.query.country_name;

        // If countryName is provided in the query parameters
        if (countryName) {
          const spots = await spotCollection
            .find({ country_Name: countryName })
            .toArray();
          res.status(200).json(spots);
        } else {
          // If countryName is not provided, return all spots
          const spots = await spotCollection.find({}).toArray();
          res.status(200).json(spots);
        }
      } catch (error) {
        console.error("Error retrieving spots:", error);
        res.status(500).json({ message: error });
      }
    });

    app.get("/countries", async (req, res) => {
      try {
        const spots = await CcountriesCollection.find({}).toArray();
        res.status(200).json(spots);
      } catch (error) {
        console.error("Error retrieving spots:", error);
        res.status(500).json({ message: error });
      }
    });

    app.get("/spotsbyId/:id", async (req, res) => {
      try {
        const spotId = req.params.id;
        console.log("Spot ID:", spotId); // Log spotId
        const spot = await spotCollection.findOne({
          _id: new ObjectId(spotId),
        });

        if (!spot) {
          console.log("Spot not found"); // Log if spot is not found
          return res.status(404).json({ message: "Spot not found" });
        }

        console.log("Spot retrieved:", spot); // Log retrieved spot
        res.status(200).json(spot);
      } catch (error) {
        console.error("Error retrieving spot:", error);
        res.status(500).json({ message: error });
      }
    });

    app.get("/spotsbyuser", async (req, res) => {
      try {
        const userEmail = req.query.user;

        const spots = await spotCollection
          .find({ "user.email": userEmail })
          .toArray();

        res.status(200).json(spots);
      } catch (error) {
        console.error("Error retrieving spots by user:");
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();
