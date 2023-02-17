# Storefront backend API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas.
Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page.
You have been tasked with building the API that will support this application, and your coworker is building the frontend.

## Storefront backend API EndPoints:
### Server EndPoint:
```
http://localhost:3000
```
#### Users:
```
(POST) => authenticate => '/users/authenticate'  ("Must to be first endpoit to generate Token to authenticate to use rest of endpoints")
(GET) => index => '/users'
(GET) => getOne => '/users/:id'
(POST) => create => '/users'
(PUT) => update => '/users'
(DELETE) => remove => '/users'
```

#### Products:
```
(GET) => index => '/products'
(GET) => getOne => '/products/:id'
(POST) => create => '/products'
(PUT) => update => '/products'
(DELETE) => remove => '/products'
```


#### Orders:
```
(GET) => index => '/orders'
(GET) => getOne => '/orders/:id'
(GET) => currentOrder => '/currentOrder'
(POST) => create => '/orders'
(PATCH) => confirmOrder => '/confirmorder'
(DELETE) => remove => '/orders'
```

### Data Shapes:
#### Users:
```
- id => uuid
- s_name => varchar
- s_email => varchar
- s_password => varchar
```

#### Products:
```
- id => uuid
- s_name => varchar
- s_description => varchar
- n_price => NUMERIC
```

#### Orders:
```
- id => uuid
- d_date => Date
- n_total_price => numeric
- s_user_id => varchar
- b_status => boolean
```

#### order_products:
```
- id => uuid
- s_order_id => uuid
- s_product_id => uuid
- n_quantity => integer
```
