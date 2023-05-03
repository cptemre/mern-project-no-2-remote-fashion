# AUTH CONTROLLERS

## REGISTER

- Register a new user. First user is admin, rest is user type.
- Client can not request to change user Type in registery.
- A verification token arrives to user's email.

## VERIFICATION

- Without verification user can not login.
- Verification controller tested for missing credentials and incorrect values.

## LOGIN

- After verification user is able to login with correct email and password.

## FORGOT PASSWORD

- Only requires email and without it, throws an error.
- Requires a correct email from database or else throws an error.

# USER CONTROLLERS

## GET ALL USERS

- Only the admin is able to get all users.

## UPDATE USER

- Admin can update all users.
- User only can update itself.

## GET SINGLE USER

- Only admin can use this controller.
- Gets the user by its id.

## SHOW CURRENT USER

- Shows the current user.

# PRODUCT CONTROLERS

## CREATE PRODUCT

- Only admin and sellers are able to create a product.

## DELETE PRODUCT

- Only admin and sellers are able to delete a product.
- Sellers can only delete their own products.
<!-- ! -->
- Later check if delete effects reviews and cart items

## UPDATE PRODUCT

- Only admin and sellers are able to update a product.
- Sellers can only update their own products.

## GET ALL PRODUCTS

- All users are able to see all products.

## GET SINGLE PRODUCT

- All users are able to see a product.

# ORDER CONTROLLERS

## CREATE ORDER

- Only admin and user are able to create orders.
- Payment is accepted in test mode.
- User cart is emptied after successful payment.
- Stock changes after creating an order succesfuly.
- Not possible to order more than stocks.

## GET ALL SINGLE ORDERS - GET ALL ORDERS

- User and seller gets only his/her single orders with req.body properties.
- Admin can see all.
- priceVal has to be calculated from client side.
- Page value works.
- Currency exchange is not tested yet.

## GET SINGLE ORDER - GET ORDER

- User and seller gets only his/her single orders with id param.
- Admin can see any single order.
- isShipping query is tested as well.
