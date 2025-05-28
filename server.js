
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}
);
//
//   const producto = {
//             nombre: req.body.nombre,
//             descripcion: req.body.descripcion,   
//             precio: req.body.precio,
//             categoria: req.body.categoria,
//             subcategoria: req.body.subcategoria,
//             imagen: req.file ? req.file.filename : null
//           };
//           required
//           required
//         </div>
