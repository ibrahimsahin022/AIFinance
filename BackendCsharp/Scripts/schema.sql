-- PostgreSQL DDL Script
-- "Yapay Zeka Destekli Bütçe Yönetim Sistemi"

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tablo: Users (Kullanıcılar)
CREATE TABLE Users (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablo: Categories (Kategoriler)
-- Tip: "Income" veya "Expense"
CREATE TABLE Categories (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    Name VARCHAR(100) NOT NULL,
    Type VARCHAR(20) NOT NULL,
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tablo: Incomes (Gelirler)
CREATE TABLE Incomes (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UserId UUID NOT NULL,
    CategoryId UUID NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Date TIMESTAMP WITH TIME ZONE NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Incomes_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Incomes_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE RESTRICT
);

-- Tablo: Expenses (Giderler)
CREATE TABLE Expenses (
    Id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    UserId UUID NOT NULL,
    CategoryId UUID NOT NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Date TIMESTAMP WITH TIME ZONE NOT NULL,
    Description TEXT,
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Expenses_Users FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Expenses_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE RESTRICT
);
