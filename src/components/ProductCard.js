import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const {name,category,cost,rating,image} = product;
  return (
    <Card className="card">
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title={name}
        component="img"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
         $ {cost}
        </Typography>
      <Rating name="read-only" value={rating} readOnly />
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" fullWidth>Add to cart</Button>
       
      </CardActions>
    </Card>
  );
};

export default ProductCard;
