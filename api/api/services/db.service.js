const databases = require('../../config/databases');

const dbService = (migrate) => {
  migrate = migrate ? migrate : true;

  async function authenticateDBs() {
    
    for (var db in databases) {
      await databases[db].authenticate();
    }
  }

  async function syncDBs() {
    for (var db in databases) {
      await databases[db].sync();
    }
  }
  
  const successfulDBStart = () => (
    console.info('connection to the database has been established successfully')
  );

  const errorDBStart = (err) => (
    console.info('unable to connect to the database:', err)
  );

  async function start() {
    try {
      await authenticateDBs();
      
      if (migrate) {
        await syncDBs();
      }

      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  return {
    start,
  };
};

module.exports = dbService;
