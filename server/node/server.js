const express=require('express');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const multer = require("multer");
const { Pool, Client } = require("pg");

require("dotenv").config();

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
  port: process.env.PORT, 
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
    console.log(name,'\n',description,'\n',tags,'\n',image);
    // Insert the binary image data into the database
    const query = "INSERT INTO items (item_name, item_description, item_tags, item_image) VALUES ($1, $2, $3, $4)";
    client.query(query, [name, description, tags, image] , (err, result)=>{
        if(err){
            console.log("here");
            console.error(err);
        }
        else{
            console.log(result.rows);
        }
    });

    res.status(200).json({ message: "Image uploaded successfully" });
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
    }
})

app.listen(()=>{
    console.log("SERVER RUNNING ON PORT", process.env.PORT);
})
