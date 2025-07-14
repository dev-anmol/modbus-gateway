CREATE TABLE DeviceProfileAddressMap (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DeviceProfileId INT NOT NULL,
    Parameter NVARCHAR(100) NOT NULL,
    RegisterAddress NVARCHAR(100) NOT NULL,
    RegisterType NVARCHAR(50) NOT NULL,
    DataType NVARCHAR(50) NOT NULL,
    Interval NVARCHAR(50),

    -- Establish the foreign key constraint
    CONSTRAINT FK_DeviceProfileAddressMap_DeviceProfile
        FOREIGN KEY (DeviceProfileId)
        REFERENCES DeviceProfile(Id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);



CREATE TABLE Devices (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Auto-incrementing primary key
    Name NVARCHAR(100) NOT NULL,
    Port NVARCHAR(50) NOT NULL,
    IPAddress NVARCHAR(50) NOT NULL,
    Mode NVARCHAR(50) NOT NULL,
    SamplingInterval NVARCHAR(50) NOT NULL,
    Timeout NVARCHAR(50) NOT NULL,
    DeviceProfileId INT NOT NULL,
    UnitId NVARCHAR(50) NULL, -- Optional

    -- Foreign key relationship to DeviceProfile(Id)
    CONSTRAINT FK_Devices_DeviceProfileId FOREIGN KEY (DeviceProfileId)
    REFERENCES DeviceProfile(Id)
);
