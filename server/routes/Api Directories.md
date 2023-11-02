#### LANDLORD API

---

## SIGN UP LANDLORD

Route -> http://localhost:5050/api/landlord/signup
Required Auth -> LANDLORD
Input -> body (JSON)
{
"email": "valid@email.com"
"password": "Strong@123Password"
}
Description: Creates a Landlord account using the req.body JSON, gets added to the
landlord MongoDB and returns a copy of the account info
Gives a response with {email,role,token}

---

## LOGIN LANDLORD

Route -> http://localhost:5050/api/landlord/login
Required Auth -> NA
Input -> body (JSON)
{
"email": "valid@email.com"
"password": "Strong@123Password"
}
Description: Checks MongoDB if email and password match. If so logs the landlord in
Gives a response with {email,role,token}

---

## GET LANDLORD DATA

Route -> http://localhost:5050/api/landlord/:id
Required Auth -> LANDLORD
Input -> NA (Data is in route)
Description: Gets landlord Data based on inputed ID

Gives a response with the Landlord Data

---

## UPDATE LANDLORD DATA

Route -> http://localhost:5050/api/landlord/edit
Required Auth -> LANDLORD
Input - body (JSON)
{
"email": "newvalid@email.com"
"password": "Strong@123Password"
}
Description: Edits the email and password of the currently logged in account
Gives a response of the OLD landlord Data

---

## DELETE LANDLORD DATA

Route -> http://localhost:5050/api/landlord/del/:id
Required Auth -> LANDLORD
Input - NA (Data is in route)
Description: Deletes the Landlord based on ID
Gives a response of the Deleted landlord Data

---

## GET ALL LANDLORD DATA

Route -> http://localhost:5050/api/landlord/
Required Auth -> LANDLORD
Input -> NA
Description: Gets All landlord Data

Gives a response with all Landlord Data

#### TENANT API

---

## SIGN UP TENANT

Route -> http://localhost:5050/api/tenant/signup
Required Auth -> LANDLORD
Input -> body (JSON)
{
"email": "valid@email.com"
"password": "Strong@123Password"
}
Description: Creates a Tenant account using the req.body JSON, gets added to the
tenant MongoDB and returns a copy of the account info

Gives a response with {email,role,token}

---

## LOGIN TENANT

Route -> http://localhost:5050/api/tenant/login
Required Auth -> NA
Input -> body (JSON)
{
"email": "valid@email.com"
"password": "Strong@123Password"
}
Description: Checks MongoDB if email and password match. If so logs the tenant in
Gives a response with {email,role,token}

---

## GET TENANT DATA

Route -> http://localhost:5050/api/tenant/:id
Required Auth -> TENANT
Input -> NA (Data is in route)
Description: Gets Tenant Data based on inputed ID

Gives a response with the Tenant Data

---

## UPDATE TENANT DATA

Route -> http://localhost:5050/api/tenant/edit
Required Auth -> TENANT
Input - body (JSON)
{
"email": "newvalid@email.com"
"password": "Strong@123Password"
}
Description: Edits the email and password of the currently logged in account
Gives a response of the OLD TEnant Data

---

## DELETE TENANT DATA

Route -> http://localhost:5050/api/tenant/del/:id
Required Auth -> LANDLORD
Input - NA (Data is in route)
Description: Deletes the tenant based on ID
Gives a response of the Deleted tenant Data

---

## GET ALL TENANT DATA

Route -> http://localhost:5050/api/tenant/
Required Auth -> LANDLORD
Input -> NA
Description: Gets All tenant Data

Gives a response with all tenant Data
