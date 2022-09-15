const bcrypt = require('bcryptjs');

const logHash = async () => {
  const hash = await bcrypt.hash('123456', 10);
  console.log(hash);
}

logHash();