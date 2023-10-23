const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "", 
  database: "hotel_sentolop", 
});

connection.connect((err) => {
  if (err) {
    console.error("Koneksi ke MySQL gagal: " + err.message);
    return;
  }
  console.log("Terhubung ke MySQL");
  app.listen(port, () => {
    console.log(`Server listen to ${port}`);
  });
});

//Kamars
app.get("/kamar", (req, res) => {
  const query = "SELECT * from kamars";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ kamars: results });
  });
});

app.post("/kamar", (req, res) => {
  const { nomor_kamar, id_tipe_kamar, harga } = req.body;
  const query = "INSERT INTO kamars (nomor_kamar, id_tipe_kamar, harga) VALUES (?, ?, ?)";

  connection.query(query, [nomor_kamar, id_tipe_kamar, harga], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }
    console.log(query)
    res.json({ message: "Berhasil menambahkan kamar" });
  });
});

app.put("/kamar/:id_kamar", (req, res) => {
  const  { id_kamar } = req.params.id_kamar;
  const { nomor_kamar, jenis_kamar, harga } = req.body;
  const query = "UPDATE kamars SET nomor_kamar = ?, jenis_kamar = ?, harga = ? WHERE id_kamar = ?";

  connection.query(query, [nomor_kamar, jenis_kamar, harga, id_kamar], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ message: "Berhasil mengupdate kamar" });
  });
});

app.delete("/kamar/:id_kamar", (req, res) => {
  const { id_kamar } = req.params.id_kamar;
  const query = "DELETE FROM kamars WHERE id_kamar = ?";

  connection.query(query, [id_kamar], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ message: "Berhasil menghapus kamar" });
  });
});

//Pemesanan
app.get("/pemesanan", (req, res) => {
  const query = "SELECT * from pemesanans";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ User: results });
  });
});

app.post('/pemesanan', (req, res) => {
  res.send("Berhasil yes")
});

app.put('/pemesanan/:id_pemesanan', (req, res) => {
  res.send("Berhasil yes")
});

app.delete('/pemesanan/:id_user', (req, res) => {
  res.send("Berhasil yes jaya jaya jaya")
});

app.get("/tipe-kamar", (req, res) => {
  const query = "SELECT * from tipe-kamars";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ User: results });
  });
});

app.post('/tipe-kamar', (req, res) => {
  res.send("Berhasil yes")
});

app.put('/tipe-kamar/:id_tipe_kamar', (req, res) => {
  res.send("Berhasil yes")
});

app.delete('/tipe-kamar/:id_tipe_kamar', (req, res) => {
  res.send("Berhasil yes jaya jaya jaya")
});

//User
app.get("/user", (req, res) => {
  const query = "SELECT * from users";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({  'data users' : results });
  });
});

app.post("/user", (req, res) => {
  const { nama_user, foto, email, password, role } = req.body;
  const query = "INSERT INTO users (nama_user, foto, email, password, role) VALUES (?, ?, ?, ?, ?)";

  connection.query(query, [nama_user, foto, email, password, role], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }
    console.log(query)
    res.json({ message: "Berhasil menambahkan users" });
  });
});

app.put("/user/:id_user", (req, res) => {
  const  { id_user } = req.params.id_user;
  const { nomor_kamar, jenis_kamar, harga } = req.body;
  const query = "UPDATE users SET nomor_kamar = ?, jenis_kamar = ?, harga = ? WHERE id_kamar = ?";

  connection.query(query, [nomor_kamar, jenis_kamar, harga, id_user], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ message: "Berhasil mengupdate kamar" });
  });
});

app.delete("/user/:id_user", (req, res) => {
  const { id_user } = req.params.id_user;
  const query = "DELETE FROM users WHERE id_user = ?";

  connection.query(query, [id_user], (err, results) => {
    if (err) {
      console.error("Error dalam eksekusi query: " + err.message);
      res.status(500).json({ error: "Terjadi kesalahan dalam server" });
      return;
    }

    res.json({ message: "Berhasil menghapus kamar" });
  });
});