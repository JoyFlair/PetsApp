-- Create the database
CREATE DATABASE IF NOT EXISTS dbpets;

-- Use the created database
USE dbpets;

-- Create table for user login
CREATE TABLE tblusers (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Adjust size as necessary for hashed passwords
    full_name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample data for user login
INSERT INTO tblusers (username, password, full_name) VALUES
('john', '$2y$10$6rYb9yQG18Dpq1zOpQ1dOOC2x/pz2Rv2wGJts8lEB6pHfhsOf64zK', 'John Doe'),
('nic', '$2y$10$CwTycUXWue0Thq9StjUM0uJ8vYwX8HRVq1aG6Y27M/6BGfU9Y.BI6', 'Nicholas Batum'),
('justin', '$2y$10$dBjJ5ZUv.cL2gRGeaX18B.nyJ0jzBclhb.bFYTGG0V0B9czMgTlW2', 'Justin Bieber');

-- Create tables for pet management
CREATE TABLE Species (
    SpeciesID INT AUTO_INCREMENT PRIMARY KEY,
    SpeciesName VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE Breeds (
    BreedID INT AUTO_INCREMENT PRIMARY KEY,
    BreedName VARCHAR(100) NOT NULL,
    SpeciesID INT,
    FOREIGN KEY (SpeciesID) REFERENCES Species(SpeciesID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE Owners (
    OwnerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    ContactDetails VARCHAR(100),
    Address VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE Pets (
    PetID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    SpeciesID INT,
    BreedID INT,
    DateOfBirth DATE,
    OwnerID INT,
    FOREIGN KEY (OwnerID) REFERENCES Owners(OwnerID),
    FOREIGN KEY (SpeciesID) REFERENCES Species(SpeciesID),
    FOREIGN KEY (BreedID) REFERENCES Breeds(BreedID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert sample data for pet management
INSERT INTO Species (SpeciesName) VALUES
('Dog'),
('Cat');

INSERT INTO Breeds (BreedName, SpeciesID) VALUES
('Labrador', 1),
('Siamese', 2);

INSERT INTO Owners (Name, ContactDetails, Address) VALUES
('Alice Johnson', '555-1234', '123 Maple St'),
('Bob Smith', '555-5678', '456 Oak St');

INSERT INTO Pets (Name, SpeciesID, BreedID, DateOfBirth, OwnerID) VALUES
('Rex', 1, 1, '2021-06-01', 1),
('Whiskers', 2, 2, '2020-09-15', 2);
