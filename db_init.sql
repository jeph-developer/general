-- SMS Database Initialization Script
-- Store Management System for DAB Enterprise LTD

CREATE DATABASE IF NOT EXISTS SMS;
USE SMS;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,  -- PK
    UserName VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- StockIn table
CREATE TABLE IF NOT EXISTS StockIn (
    StockInID INT AUTO_INCREMENT PRIMARY KEY,  -- PK
    ItemName VARCHAR(150) NOT NULL,
    Description TEXT,
    QuantityIn INT NOT NULL DEFAULT 0,
    TotalQuantityIn INT DEFAULT 0,
    SupplierName VARCHAR(150),
    StockInDate DATE NOT NULL,
    UserID INT NOT NULL,  -- FK references Users(UserID)
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- StockOut table
CREATE TABLE IF NOT EXISTS StockOut (
    StockOutID INT AUTO_INCREMENT PRIMARY KEY,  -- PK
    ItemName VARCHAR(150) NOT NULL,
    QuantityOut INT NOT NULL DEFAULT 0,
    TotalQuantityOut INT DEFAULT 0,
    StockOutDate DATE NOT NULL,
    UserID INT NOT NULL,  -- FK references Users(UserID)
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- Seed data: Default users
INSERT INTO Users (UserName, Password) VALUES
('admin', 'admin123'),
('john', 'john123');

-- Seed data: Stock In records
INSERT INTO StockIn (ItemName, Description, QuantityIn, TotalQuantityIn, SupplierName, StockInDate, UserID) VALUES
('Steel bars', '12mm steel bars', 500, 500, 'BuildCo Ltd', '2026-06-01', 1),
('Wheelbarrows', 'Heavy duty wheelbarrow', 50, 50, 'EquipSupplies', '2026-06-01', 1),
('Ceramic tiles', '60x60 ceramic floor tiles', 1000, 1000, 'TilePro', '2026-06-02', 1),
('Cement', 'Portland cement 50kg bags', 2000, 2000, 'CementCo', '2026-06-02', 1),
('Painting brush', '4 inch painting brush', 300, 300, 'PaintWorld', '2026-06-03', 2),
('Color Paint', 'Blue emulsion paint 5L', 150, 150, 'PaintWorld', '2026-06-03', 2),
('Masonry nails', '2 inch masonry nails (kg)', 100, 100, 'BuildCo Ltd', '2026-06-04', 1),
('Iron sheets', 'Gauge 28 iron sheets', 400, 400, 'RoofingPro', '2026-06-04', 2);

-- Seed data: Stock Out records
INSERT INTO StockOut (ItemName, QuantityOut, TotalQuantityOut, StockOutDate, UserID) VALUES
('Steel bars', 50, 50, '2026-06-02', 1),
('Cement', 200, 200, '2026-06-03', 2),
('Ceramic tiles', 100, 100, '2026-06-04', 1),
('Wheelbarrows', 10, 10, '2026-06-04', 2),
('Painting brush', 25, 25, '2026-06-05', 1),
('Color Paint', 20, 20, '2026-06-05', 2);
