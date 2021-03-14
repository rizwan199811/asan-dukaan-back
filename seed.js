const CategoryModel = require('./models/category');
const UserModel = require('./models/user')
const mongoose = require('mongoose');

const passwordUtils = require('./utils/passwordHash');

require('dotenv').config()
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
let type = {
  product: 'product',
  shop: 'shop'
}
categories = [{
  name: "Services",
  _type: type.shop
},
{
  name: "Shops",
  _type: type.shop
},
{
  name: "Stalls",
  _type: type.shop
},
{
  name: "Stores",
  _type: type.shop
},
{
  name: "Baby",
  _type: type.product
},
{
  name: "Beverages",
  _type: type.product
},
{
  name: "Bread & Bakery",
  _type: type.product
},
{
  name: "Breakfast & Cereal",
  _type: type.product
},
{
  name: "Canned Goods & Soups",
  _type: type.product
},
{
  name: "Condiments/Spices & Bake",
  _type: type.product
},
{
  name: "Cookies, Snacks & Candy",
  _type: type.product
},
{
  name: "Dairy, Eggs & Cheese",
  _type: type.product
},
{
  name: "Deli & Signature Cafe",
  _type: type.product
},
{
  name: "Flowers",
  _type: type.product
},
{
  name: "Frozen Foods",
  _type: type.product
},
{
  name: "Fruits & Vegetables",
  _type: type.product
},
{
  name: "Grains, Pasta & Sides",
  _type: type.product
},
{
  name: "International Cuisine",
  _type: type.product
},
{
  name: "Meat & Seafood",
  _type: type.product
},
{
  name: "Health & Beauty",
  _type: type.product
},
{
  name: "Pharmacy",
  _type: type.product
},
{
  name: "Cleaning Supplies",
  _type: type.product
},
{
  name: "Electronics",
  _type: type.product
},
{
  name: "Cutlery",
  _type: type.product
},
{
  name: "Tobacco",
  _type: type.product
},
{
  name: "Stationary",
  _type: type.product
},
{
  name: "Paper products",
  _type: type.product
},
];
db.once('open', async function () {
  console.log('Database is connected!');
  // Insert All The Dropdowns With Basic Options
  try {
    console.log(categories[1])
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i]
      let newCategory = new CategoryModel({ category: { ...category } 
      });
      await newCategory.save();
    }
  } catch (e) {
    console.log(e)
  }
  mongoose.disconnect();
});

/*

Baby
Beer, Wine & Spirits
Beverages:  tea, coffee, soda, juice, Kool-Aid, hot chocolate, water, etc.
Bread & Bakery
Breakfast & Cereal
Canned Goods & Soups
Condiments/Spices & Bake
Cookies, Snacks & Candy
Dairy, Eggs & Cheese
Deli & Signature Cafe
Flowers
Frozen Foods
Produce: Fruits & Vegetables
Grains, Pasta & Sides
International Cuisine
Meat & Seafood
Miscellaneous – gift cards/wrap, batteries, etc.
Paper Products – toilet paper, paper towels, tissues, paper plates/cups, etc.
Cleaning Supplies – laundry detergent, dishwashing soap, etc.
Health & Beauty, Personal Care & Pharmacy – pharmacy items, shampoo, toothpaste
Pet Care
Pharmacy
Tobacco
*/