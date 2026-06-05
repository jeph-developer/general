-- =============================================================
-- STORE MANAGEMENT SYSTEM (SMS) - DATABASE SCHEMA
-- DAB Enterprise LTD, Kigali City, Rwanda
-- =============================================================
-- This script defines the complete database structure including:
--   • Tables with columns, data types, and constraints
--   • Primary Keys (PK) and Foreign Keys (FK)
--   • Entity relationships
--   • Indexes for performance
-- =============================================================

CREATE DATABASE IF NOT EXISTS SMS;
USE SMS;

-- =============================================================
-- TABLE: Users
-- Description: Stores system user credentials for authentication
-- =============================================================
CREATE TABLE Users (
    UserID      INT           AUTO_INCREMENT PRIMARY KEY,  -- PK: Unique user identifier
    UserName    VARCHAR(100)  NOT NULL UNIQUE,              -- Unique login username
    Password    VARCHAR(255)  NOT NULL,                     -- Hashed password
    CreatedAt   DATETIME      DEFAULT CURRENT_TIMESTAMP     -- Account creation timestamp
);

-- =============================================================
-- TABLE: StockIn
-- Description: Records all incoming stock receipts.
--   When an item is received, its quantity in stock increases.
--   Each record tracks the item, quantity, supplier, date,
--   and the user who processed the receipt.
-- =============================================================
CREATE TABLE StockIn (
    StockInID       INT           AUTO_INCREMENT PRIMARY KEY,  -- PK: Unique receipt identifier
    ItemName        VARCHAR(150)  NOT NULL,                     -- Item name (e.g. Cement, Steel bars)
    Description     TEXT,                                       -- Optional description / specifications
    QuantityIn      INT           NOT NULL DEFAULT 0,           -- Quantity received in this transaction
    TotalQuantityIn INT           DEFAULT 0,                    -- Cumulative quantity of this item received
    SupplierName    VARCHAR(150),                                -- Name of the supplier
    StockInDate     DATE          NOT NULL,                     -- Date of receipt
    UserID          INT           NOT NULL,                     -- FK → Users(UserID): Who recorded this
    CreatedAt       DATETIME      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stockin_user
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_stockin_item (ItemName),
    INDEX idx_stockin_date (StockInDate),
    INDEX idx_stockin_supplier (SupplierName)
);

-- =============================================================
-- TABLE: StockOut
-- Description: Records all outgoing stock issues.
--   When an item is issued out of stock, its quantity reduces.
--   Each record tracks the item, quantity, date,
--   and the user who processed the issue.
-- =============================================================
CREATE TABLE StockOut (
    StockOutID       INT           AUTO_INCREMENT PRIMARY KEY,  -- PK: Unique issue identifier
    ItemName         VARCHAR(150)  NOT NULL,                     -- Item name (e.g. Cement, Steel bars)
    QuantityOut      INT           NOT NULL DEFAULT 0,           -- Quantity issued in this transaction
    TotalQuantityOut INT           DEFAULT 0,                    -- Cumulative quantity of this item issued
    StockOutDate     DATE          NOT NULL,                     -- Date of issue
    UserID           INT           NOT NULL,                     -- FK → Users(UserID): Who recorded this
    CreatedAt        DATETIME      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stockout_user
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_stockout_item (ItemName),
    INDEX idx_stockout_date (StockOutDate)
);

-- =============================================================
-- RELATIONSHIPS SUMMARY
-- =============================================================
--
--  Users (1) ──── (N) StockIn
--    One user can record many StockIn transactions.
--    StockIn.UserID references Users.UserID.
--
--  Users (1) ──── (N) StockOut
--    One user can record many StockOut transactions.
--    StockOut.UserID references Users.UserID.
--
--  StockIn and StockOut are linked logically via ItemName
--    for stock level calculations:
--      Remaining Stock = SUM(StockIn.QuantityIn) - SUM(StockOut.QuantityOut)
--      grouped by ItemName.
--
-- =============================================================
-- PRIMARY KEYS AND FOREIGN KEYS REFERENCE
-- =============================================================
--
--  Table       | Primary Key    | Foreign Key(s)
--  ------------+----------------+--------------------------
--  Users       | UserID (PK)    | —
--  StockIn     | StockInID (PK) | UserID (FK → Users)
--  StockOut    | StockOutID (PK)| UserID (FK → Users)
--
-- =============================================================

-- =============================================================
-- SAMPLE QUERY: Daily Stock Status Report
-- =============================================================
--
--  SELECT
--      items.ItemName,
--      COALESCE(SUM(si.QuantityIn), 0)  AS TotalQuantityReceived,
--      COALESCE(SUM(so.QuantityOut), 0) AS TotalQuantityIssued,
--      COALESCE(SUM(si.QuantityIn), 0) - COALESCE(SUM(so.QuantityOut), 0) AS RemainingStock
--  FROM (
--      SELECT DISTINCT ItemName FROM StockIn
--      UNION
--      SELECT DISTINCT ItemName FROM StockOut
--  ) items
--  LEFT JOIN StockIn  si ON items.ItemName = si.ItemName
--  LEFT JOIN StockOut so ON items.ItemName = so.ItemName
--  GROUP BY items.ItemName
--  ORDER BY items.ItemName;
