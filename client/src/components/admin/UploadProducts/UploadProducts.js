import { useState, useEffect } from "react";
import axios from "axios";
import {MultiSelect} from 'react-multi-select-component';

import itemsArray from "./tags";

import Navbar from "../Navbar/Navbar";

import "./UploadProducts.css";

const UploadProduct = () => {

  const [itemName, setItemName]=useState("");
  const [error, setError]=useState(false);
  const [itemDescription, setItemDescription]=useState("");
  const [selected, setSelected]=useState([]);
  const [selectedImage, setSelectedImage]=useState(null);
  const [imageUrl, setImageUrl]=useState(null);
  const [loading, setLoading]=useState(false);

  useEffect(()=>{
    if(selectedImage){
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  const handleSubmit= async()=>{
    try{
      if (itemName.length === 0) {
        setError(true);
        return;
      }
      if(selected.length===0){
        setError(true);
        return;
      }
      if(!selectedImage){
        setError(true);
        return;
      }
      let tags=[];
      selected.forEach((item)=>{
        tags.push(item.value);
      });
      setLoading(true);
      const res = await axios.post(process.env.REACT_APP_SERVER_URL+"/admin-product-upload", {
        itemName: itemName,
        itemDescription: itemDescription,
        tags: tags,
        image: selectedImage,
      }, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      console.log(res.data.message);
      window.location.reload();
    }catch(err){
      alert("Some error occurred! Please try after some time!");
      setLoading(false);
      console.log(err);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#007bff" : "red",
      color: state.isSelected ? "white" : "black",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#007bff",
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      ":hover": {
        backgroundColor: "#0056b3",
      },
    }),
  };
  
  return (
    <>
    <Navbar />
    <div className="app">
      
      { loading &&
        <div className="loader">
          <div className="loading-spinner" />
        </div>
      }
      <div className="center-container">
        <h1 style={{ textAlign: "center" }}>ADMIN PRODUCT UPLOAD PANEL</h1>
        <div>
          <div className="product-details">
            <input 
              placeholder="Enter Product Name..." 
              onChange={(e)=>{
                setItemName(e.target.value);
              }} 
            />
            { error && itemName.length===0 &&
              <div className="error">
                Item name required!
              </div>

            }
            <input 
              placeholder="Enter Product Description..."
              onChange={(e)=>{
                setItemDescription(e.target.value);
              }}
            />
            {
              error && itemDescription.length===0 &&
              <div className="error">
                Item description required!
              </div>
            }
            <div>
              <MultiSelect
                style={{ width: "150px" }}
                styles={customStyles}
                options={itemsArray}
                value={selected}
                onChange={setSelected}
                labelledBy={"Select"}
                isCreatable={true}
              />
            </div>
            { error && selected.length===0 &&
              <div className="error"> 
                No item tags selected!
              </div>  

            }
            {selected.length > 0 && 
              <div className="tags">
                {selected.map((select) => {
                  return <span key={select.label}>{select.label}</span>;
                })}
              </div>
            }
          </div>
          <div className="product-image">
            <input
              type="file"
              id="upload-image"
              accept="image/*"
              onChange={(e) => {
                setSelectedImage(e.target.files[0]);
              }}
            />
            <label htmlFor="upload-image" className="upload-image-button">
              Upload Image 
            </label>
            { error && selectedImage==null &&
              <div className="error">
                Image Required!
              </div>
            }
            { selectedImage &&
              <div>
                <img src={imageUrl} alt={selectedImage.name}/>
              </div>
            }
            <button onClick={handleSubmit}>submit</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UploadProduct;
