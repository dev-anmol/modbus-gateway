module.exports = {
  createServer: `
      INSERT INTO Servers (ServerIpAddress, ServerPort, PoolSize, UnitId, Interval, Name)
      VALUES (@ServerIpAddress, @ServerPort, @PoolSize, @UnitId, @Interval, @Name)
    `,
  getServerDetails: `
      SELECT * FROM Servers
    `,
  getServerById: `SELECT * FROM Servers WHERE Id = @Id`,
  updateServerProfile: `
    UPDATE Servers
    SET Name = @Name,
        ServerPort = @ServerPort,
        ServerIpAddress = @ServerIpAddress,
        Interval = @Interval,
        UnitId = @UnitId,
        PoolSize = @PoolSize
    WHERE Id = @Id
`,
  deleteServerProfile: `
    DELETE FROM Servers WHERE Id = @Id
  `
};
