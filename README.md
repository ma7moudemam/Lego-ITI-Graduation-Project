# **`| Lego`**

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
- /shippers

```
> ## **Schema**

* [`User`](#user)
* [`Product`](#product)
* [`Review`](#review)
* [`Stock`](#stock)
* [`Orders`](#category)
* [`Cart`](#cart)
* [`Shippers`](#shippers)
* [`Payment`](#payment)
* [`BlackList`](#blacklist)


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
    amount:Number,
    sold:Number
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
}
```

## **`Category`**
``` js
{
    _id: Number, 
    name: String,
    product: {type:Number,ref:"prouct"}
}
```

## **`Orders`**
``` js
{
    _id: Number, 
    user: String,
    product: [{
        product:{type:Number,ref:"prouct"},
        amount:Number,
        unit_price:Number
        }],
    shippers:{type:Number,ref:"shippers"},
    tax:Number,
    payment:{type:Number,ref:"payment"},
    order_date:Date,
    order_status:Number
}
```

## **`Cart`**
``` js
{
    _id: Number, 
    total_price: Number,
    product: [{type:Number,ref:"prouct"}],
    user:{type:String,ref:"user"}
}
```

## **`Shippers`**
``` js
{
    _id: Number, 
    name: String,
    contact:[{
        email:String,
        phone_number:Number
    }]
}
```

## **`Payment`**
``` js
{
    _id: Number, 
    user:{type:String,ref:"user"},
    card_number:{type:Number,min:16,max:16},
    exp_month:{type:Number,min:2,max:2},
    exp_year:{type:Number,min:2,max:2},
    CVV:{type:Number,min:3,max:3}
}
```

## **`BlackList`**
``` js
{
    _id: Number, 
    user:{type:String,ref:"user"}
}
```
