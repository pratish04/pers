const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const multer = require("multer");
const { Pool, Client } = require("pg");

require('dotenv').config();

const PORT=process.env.PORT || 3001;

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin:['http://localhost:3000'],
    // credentials: true,
}));

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PG_PORT,
  ssl: {
    // Here, you can provide additional SSL options if needed
    rejectUnauthorized: false, // You may need to set this to false if using self-signed certificates
  },
});

client.connect()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/admin-product-upload", upload.single("image"), async (req, res) => {
  try {
    const name=req.body.itemName;
    const description=req.body.itemDescription;
    const tags=req.body.tags;
    const image=req.file.buffer;
    // Insert the binary image data into the database
    const query = "INSERT INTO items (item_name, item_description, item_tags, item_image) VALUES ($1, $2, $3, $4)";
    client.query(query, [name, description, tags, image] , (err, result)=>{
        if(err){
            console.error(err);
        }
        else{
            console.log('ITEM UPLOADED SUCCESSFULLY!');
        }
    });

    res.status(200).json({ message: "ITEM UPLOADED SUCCESSFULLY!" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/view-products', async(req, res)=>{
    try{
        const query = "SELECT * FROM items ORDER BY item_id DESC";
        client.query(query, (err, result)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("hiihi");
                console.log(result.rows);
                res.send({items: result.rows});
            }
        })

    }catch(err){
      console.log("Error fetching products: ", err);
      res.status(500).json({message:"Server Error!"});
    }
})

app.listen(PORT, ()=>{
    console.log("SERVER RUNNING ON PORT", PORT);
})
