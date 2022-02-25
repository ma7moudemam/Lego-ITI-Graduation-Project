# **`| Lego-ITI-Graduation-Project`**

> ## **Endpoints**
``` 
- /login
- /register
- /user
- /products
- /home
- /cart
- /wishlist
- /dashboard
```
> ## **Schema**

* [`User`](#user)
* [`Product`](#product)
* [`Review`](#review)
* [`Stock`](#stock)
* [`Category`](#category)


 ## **`User`**
``` js
{
    _id : Number,
    email: {type:String,unique:true},
    address:
        {
            country:String,
            city:String,
            street:String,
            building:Number,
        },
    password: String,
    age : Number,
    review : [{type:Number,ref:"review"}],
    wish_list: [{type:Number,ref:"product"}],
}
```
## **`Product`**
``` js
{
    _id:Number,
    name: String,
    images:[{type:String}],
    price:Number,
    rating:Number,
    review: [{type:Number,ref:"review"}],
    stock: {type:Number,ref:"stock"},
    category: {type:Number,ref:"category"}
}
```
## **`Review`**
``` js
{
    _id : Number,
    user : {type:Number,ref:"user"},
    product : {type:Number,ref:"product"},
    comment : String
    rating : Number
    date : Date
}
```
## **`Stock`**
``` js
{
    id : Number,
    product :{type:Number,ref:"product"},
    amount : Number,
    remaining : Number,
    sold : Number, 
    total_price : Number
}
```

## **`Category`**
``` js
{
    _id: Number, 
    name: String,
    products: {type:Number,ref:"prouct"}
}
```
> ## **ERD**
[`ERDiagram`](./Lego.pdf)
