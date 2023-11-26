import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../Navbar/Navbar";

import "./ViewProducts.css";

const ViewProducts=()=>{
  const [items, setItems] = useState([]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  useEffect(() => {
    const fetchData = async()=>{
      try{
        const res = await axios.get(
          "http://localhost:3001/view-products"
        );
        setItems(res.data.items);
      }catch(err){
        console.log("Error: ", err);
      }
    }
    fetchData();
  }, []);

  const createBlobFromBinary = (binaryData) => {
    const blob = new Blob([new Uint8Array(binaryData)], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  };

  return (
    <>
      <Navbar />
      <div className="app">
        <table>
          <thead>
            <tr
              style={{
                position: "fixed",
                backgroundColor: "white",
                margin: "-3px",
              }}
            >
              <th>item_id</th>
              <th>item_name</th>
              <th>item_description</th>
              <th>item_tags</th>
              <th>item_image</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              return (
                <tr key={item.item_id}>
                  <td>{item.item_id}</td>
                  <td>{item.item_name}</td>
                  <td>{item.item_description}</td>
                  <td>{item.item_tags.join(", ")}</td>
                  <td>
                    {item.item_image.data && (
                      <img
                        src={createBlobFromBinary(item.item_image.data)}
                        alt={item.item_name}
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewProducts;