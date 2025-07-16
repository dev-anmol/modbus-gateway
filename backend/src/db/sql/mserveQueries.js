module.exports = {
    createServer: `
      INSERT INTO Servers (ServerIpAddress, ServerPort, PoolSize, UnitId, Interval)
      VALUES (@ServerIpAddress, @ServerPort, @PoolSize, @UnitId, @Interval)
    `
  };
  