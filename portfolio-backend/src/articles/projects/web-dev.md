---
title: Reservation Application
id: web-dev
timestamp: 1700252551922
---

### Restaurant Reservation Application

The restaurant reservation app is an web page made to take reservations and handle managing reservations for a hypothetical resaurant. The full stack app can accept new reservations, will allow current reservations to be edited, can seat reservations, and can edit seating arrangements.

The app includes four main pages: 

- Dashboard: Reservations for the day and the current seating arrangement can be viewed here

- Search: User may search for reservations by their phone number or partial phone number

- New Reservation: User may create a reservation from this page

- New Table: User may add a table for seating from this page

#### Specifics of Implimentation:

*Reservation creation*

When users create a reservation, name, phone number, date, time, and reservation size are required. Error checking ensures reservation is only made for hours that are open (10:30am to 9:30pm, any day except Tuesday). The phone number must have only digits and dashes (validity is not checked due to the large number of variations in typing and layout of number). The number of people in the reservation must be greater than 0.

*Reservation editing*

Users may edit reservations that have not been seated yet. The name, phone number, date, and time may all be changed, but only to valid values. If a reservation has been seated, finished, or cancelled, it may not be edited

*Reservation managing*

Users can cancel reservations that have not yet been seated. Users can seat reservations at open tables, but only if the table has capacity to hold the whole reservation. Seated reservations may be finished to free up the table. 

#### Technology Used:

The application is made with React and React-Routing in the frontend and with Node, Express, and Knex in the backend. The database uses PostgreSQL on an ElephantSQL server. Bootstrap is used for styling