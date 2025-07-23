module.exports = {
    createServer: `
      INSERT INTO Servers (ServerIpAddress, ServerPort, PoolSize, UnitId, Interval, Name)
      VALUES (@ServerIpAddress, @ServerPort, @PoolSize, @UnitId, @Interval, @Name)
    `,
    getServerDetails: `
      SELECT * FROM Servers
    `
  };
  