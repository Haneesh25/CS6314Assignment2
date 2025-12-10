-- database.sql
CREATE DATABASE IF NOT EXISTS travel_deals;
USE travel_deals;

-- Users
CREATE TABLE IF NOT EXISTS users (
  phone VARCHAR(12) PRIMARY KEY,  -- format ddd-ddd-dddd
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  gender ENUM('M','F','Other') DEFAULT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights
CREATE TABLE IF NOT EXISTS flights (
  flight_id INT PRIMARY KEY,
  origin VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  departure_date DATE NOT NULL,
  arrival_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  availableSeats INT NOT NULL,
  airline VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Hotels
CREATE TABLE IF NOT EXISTS hotels (
  hotel_id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL
);

-- Flight Booking (one booking per flight; same booking ID used for group booking)
CREATE TABLE IF NOT EXISTS flight_booking (
  flight_booking_id INT AUTO_INCREMENT PRIMARY KEY,
  flight_id INT NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);

-- Ticket table
CREATE TABLE IF NOT EXISTS tickets (
  ticket_id INT AUTO_INCREMENT PRIMARY KEY,
  flight_booking_id INT NOT NULL,
  ssn VARCHAR(11) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (flight_booking_id) REFERENCES flight_booking(flight_booking_id)
);

-- Passengers
CREATE TABLE IF NOT EXISTS passengers (
  ssn VARCHAR(11) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  category ENUM('adult','child','infant') NOT NULL
);

-- Hotel Booking
CREATE TABLE IF NOT EXISTS hotel_booking (
  hotel_booking_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_rooms INT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Guests (guesses)
CREATE TABLE IF NOT EXISTS guesses (
  ssn VARCHAR(11) PRIMARY KEY,
  hotel_booking_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  category ENUM('adult','child','infant') NOT NULL,
  FOREIGN KEY (hotel_booking_id) REFERENCES hotel_booking(hotel_booking_id)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    phone VARCHAR(20),
    gender VARCHAR(10),
    email VARCHAR(100),
    comment TEXT,
    timestamp DATETIME
);

