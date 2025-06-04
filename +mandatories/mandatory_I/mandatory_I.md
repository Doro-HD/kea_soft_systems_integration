# Mandatory I

## 01a-03a

Assignments 01a through 03a were all collected into a single project

[Data parsing server project](https://github.com/Doro-HD/kea_soft_systems_integration/tree/main/assignments/01a-03a._Data_parsing_server)

## 04a

[Server sent event example](https://github.com/Doro-HD/kea_soft_systems_integration/tree/main/13._Server-sent_event)

## 04b

### Exposee documentation

The below documentation is copied from my logseq graph

- # Documentation
  - ## Connect
    - For my database I chose postgres so be sure to install postgresql so that you can run the cli tool used in this documentation
    - For this exercise I will be providing you with two db users. see username below, for easy use both of their passwords are 'si-o4b'
      - lasse
      - troels
    - As I use [Pinggy](https://pinggy.io), the free tier only allow for random subdomains, I will be providing the host and port name to you upon request instead of in this documentation
    - ## To connect to the db instance via my TCP tunnel, use the following command, replace the placeholder with the information provided upon your request
      ```
      psql -h <host> -p <port> -U <lasse|troels> -d si-04b
      ```
  - ## Granular control
    - ### Views
      - masked_employee_salary
        - Restricts employees access to each others salary in the employee table, allows sales persons to see their own salary and managers to see all but other managers salary
    - ### Roles
      - customer
        - ### Access level
          - SELECT (name, price) on products table
          - SELECt on customer, but only their own row
          - SELECT on purchases, but only their own
          - SELECT on discounts, but only their own
      - sales_person
        - ### Access level
          - SELECT on products
          - SELECT on customers
          - SELECT, INSERT on purchases, but only with their own id
          - SELECT, INSERT on discounts, but only with their own id
          - SELECT (id, name) on employees
          - SELECT on masked_employee_salary
      - manager
        - ### Access level
          - SELECT, INSERT, UPDATE, DELETE on products
          - SELECT, INSERT, UPDATE, DELETE on customers
          - SELECT, INSERT, UPDATE, DELETE on purchases
          - SELECT, INSERT, UPDATE, DELETE on discounts
          - SELECT, INSERT, UPDATE, DELETE on employees but their own or other managers
          - SELECT on masked_employee_salary
    - The two users provided in the previous section have different levels of control in the database
    - The user 'lasse' has the sales_person role
    - The user 'troels' has the manager role
  -

### Integrator images

#### Read only table

![Could not find image](https://raw.githubusercontent.com/Doro-HD/kea_soft_systems_integration/refs/heads/main/mandatories/mandatory_I/read_only_table.png)

#### Write only table

![Could not find image](https://raw.githubusercontent.com/Doro-HD/kea_soft_systems_integration/refs/heads/main/mandatories/mandatory_I/write_only_table.png)

#### Restricted table

I could only see my own user in the table

![Could not find images](https://raw.githubusercontent.com/Doro-HD/kea_soft_systems_integration/refs/heads/main/mandatories/mandatory_I/restricted_table.png)

## 06a

[Websocket example](https://github.com/Doro-HD/kea_soft_systems_integration/tree/main/14._Websocket/01._node)
