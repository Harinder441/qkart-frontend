import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [timerId, setTimerId] = useState(null);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  useEffect(() => {
    (async function () {
      const data = await performAPICall();
      setProducts(data);
    })();
    // console.log(data);
  }, []);

  const performAPICall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(config.endpoint + "/products");
      if (res.status === 200) {
        console.log(res.data);
        return res.data;
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error.response);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const res = await axios.get(
        config.endpoint + "/products/search?value=" + text
      );
      if (res.status === 200) {
        console.log(res.data);
        setProducts(res.data);
        return res.data;
      } else {
        throw new Error("something went wrong");
      }
    } catch (error) {
      console.log(error.response);
      setProducts([]);
      return [];
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(timerId);
    let newId = setTimeout(
      () => performSearch(event.target.value),
      debounceTimeout
    );
    setTimerId(newId);
  };

  //   useEffect(()=>{
  //     (async function () {
  //       const data = await performSearch(search);
  //       setProducts(data);
  //     })();

  // },[search]);
  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <SearchComponent
          view="desktop"
          search={search}
          setSearch={setSearch}
          debounceSearch={debounceSearch}
        />
      </Header>

      {/* Search view for mobiles */}
      <SearchComponent
        view="mobile"
        search={search}
        setSearch={setSearch}
        debounceSearch={debounceSearch}
      />
      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={4} sx={{ p: 2 }}>
            {!loading ? (
              products.length < 1 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "500px",
                    width: "100%",
                  }}
                >
                  No Products Found
                </div>
              ) : (
                <>
                  {products.map((product) => (
                    <Grid item xs={6} md={3} key={product._id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </>
              )
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "500px",
                    width: "100%",
                  }}
                >
                  <CircularProgress />
                  Loading Products...
                </div>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

/**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} view
   *   Can be "mobile" or "desktop"
   *

   */
const SearchComponent = ({ view, search, setSearch, debounceSearch }) => {
  return (
    <TextField
      className={view === "mobile" ? "search-mobile" : "search-desktop"}
      size="small"
      fullWidth={view === "mobile"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        debounceSearch(e, 500);
      }}
    />
  );
};
export default Products;
