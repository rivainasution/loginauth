# backenddipenogoro

# configurasi
Untuk database menggunakan sql server 
buat database dan setting di bagian models database index 

Code : edit sesauikan dengan user dan password kalian jangan lupa untuk buat database bernama "report"
const sequelize = new Sequelize('report', 'test', '123456', {
    dialect: 'mssql',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1,
      },
    },
  });

# menjalankan Program
untuk menjalankan jangan lupa awal npm install agar package semua terinstall
untuk menjalankan program menggunakan nodemon start
