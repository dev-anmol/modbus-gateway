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
