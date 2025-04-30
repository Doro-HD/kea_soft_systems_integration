# 04b - Database Granular Access
This assignment had me setup a database such that a user is restricted in how they can access data, down to lowest possible unit of that database.

## Database
For this assignment I had to research and choose a database to setup, this part was by far the hardest as, from the way I undestand the assignment, I need to use a database that can control access to it's lowest possible unit. Meaning I was looking for a database with a syntax that would allow something akin to the below psudo sql code.

```sql
GRANT SELECT on <table>.<column> WHERE CELL = 'Foo' TO <role/user>;
```

I was not able to find a database that would allow me to give a "Grant" on a cell level, and from my own reasearch "NoSQL" databases also fell short in regards to access control on their lowest unit of data.\
However, I have found databases with functionality that can simulate the desired behavior to some degree. And from those I have chosen Postgres as my database for this assignment for the following reasons.

- Industry grade database
    - Widely used and has a lot of features
- Has role based authentication
- Row level security, Postgres allows adding security on top of the data, this can be:
    - For validation of new data
    - Who can access specific rows or columns

## Granular access setup
As stated earlier Postgres does not allow for a syntax that gives "Grants" down to a cell level, like how you can grant access to select statements on a table, and enven specify which columns on that table should you so desire. And if you use "Row Level Security" (RLS) you can narrow which rows are avaible to the authorized user.\
What we can do to achieve a similar result, is by using a combination of views and "RLS". Take the below example.

```sql
CREATE VIEW safe_users AS
	SELECT
        users.id,
        "name",
        CASE
            WHEN db_users.username = CURRENT_USER THEN social_security_number
            ELSE '***'
        END AS social_security_number,
        "role"
   FROM users
   LEFT JOIN db_users ON users.id = db_users.user_id;
```

This view returns all the same columns that a normal select on the users table would, but as for the social security number column, the view performs a check to see if the given row belongs to the authorized user. If so, then social security number will be visible for that row and that row only.\
We cannot choose which cells are returned from a sql query in Postgres, we have to specify the columns. What we can do, however, is modify the result, which in this case is by changing the return value, of that column, depending on the authorized user performing the query.\
For a "SELECT" statement we can then transform the data although not the access, and achieve a similar result.

For "INSERT" and "UPDATE" we use row level security to control what values a cell can be.

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY superintendent_safeguard_insert ON users
	FOR INSERT
	TO anders
  WITH CHECK ("role" = 'tenant');
```

The above example shows that for a table "users", the role "anders" cannot insert a row where the role column is not equal to "tenant". A somewhat basic example, if we had more roles we would instead check if the role was not equal to admin or something similar, thereby providing a set of availble roles for "anders" to use instead of just one.

## Documentation

### User
For this assignment I have create the user "anders" based on the superintendent that was at my dorm, as the theme for the database is a dorm administration.\
As I can only dynamically generate an url you will have to ask me for the host url and port number, before attempting to login. Below should be the nessesary credentials to login.

Database: si-04b\
Username: anders\
Password: si-04b

How you cannot is up to you but here is an example using "psql".
```sh
psql -h <host-url> -p <port> -U anders -d si-04b
```

### Database structure
Once you are logged in you can use this part of the documentation to navigate the database.

The database has the following tables which "anders" can acces to a specified degree:
- users
    - Can read and write data, however:
        - "anders" can only read the id and name columns, this was nessesary to allow for update.
        - "anders" and any authorized user, can only see other columns, than the ones above, through the "safe_users" view. And this view obscures the "social_security_number" column cell value, execpt for the users own row.
        - "anders" can insert a new row, but only with the role "tenant".
        - "anders" can only update the name of a user.
- db_users
    - "anders" cannot read or write to this table
- complaints
    - "anders" can only read from this table
