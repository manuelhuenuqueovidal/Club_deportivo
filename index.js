//Importaciones
import express from 'express';
import fs from 'fs';

//Constante Express y sevidor ok.
const app = express();
app.listen(3000, () => {console.log('El servidor está inicializado en el puerto 3000 👌')
})

//Carpeta pública.
app.use(express.static("public"));

//Ruta para agregar datos.
app.get('/agregar', (req, res) => {
  const { nombre, precio } = req.query;
  //Constante para gurdar datos desde el archivo HTML.
  const nuevoDeporte = {
    nombre: nombre,
    precio: precio
  };
  // Leer el deportes.json.
  fs.readFile('deportes.json', 'utf8', (err, data) => {
    //Crear array
    let deportes = [];
    //Control de errores.
    if (err) {
      console.error('Error al leer el archivo:', err);
    } else {
      //Parseo de variable.
      deportes = JSON.parse(data);
    }
    //Agregar nuevo dato al array.
    deportes.push(nuevoDeporte);
    //Escribir en el archivo Json.
    fs.writeFile('deportes.json', JSON.stringify(deportes), err => {
      if (err) {
        //Control de errores.
        console.error('Error al escribir en el archivo:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      //Respuesta positiva.
      res.send('Deporte agregado correctamente. 👍');
    });
  });
});

// Ruta para devolver todos los usuarios de archivo Json.
app.get('/deportes', (req, res) => {
  //Leer archivo Json.
  fs.readFile('deportes.json', 'utf8', (err, data) => {
    //Control de errores.
    if (err) {
      console.error('Error al leer el archivo:', err);
      res.status(500).json({ error: 'Error al leer el archivo' });
      return;
    }
    //Parseo de Json.
    const deportes = JSON.parse(data);
    res.json({ deportes });
  });
});

//Modificar precio.
app.get("/editar", (req, res) => {
  const { nombre, precio } = req.query;
  //Se lee el archivo Json.
  fs.readFile('deportes.json', 'utf8', (err, data) => {
    let deportes = JSON.parse(data);
    // Buscar el deporte por nombre para actualizar el precio.
    let deporte = deportes.find(d => d.nombre === nombre);
    if (deporte) {
      //Buscar precio.
      deporte.precio = precio;
      //Modificar Json.
      fs.writeFile('deportes.json', JSON.stringify(deportes), err => {
      res.send('Precio actualizado correctamente. 👍');
      });
    } else {
      //Control de errores.
      res.send('Deporte no encontrado');
    }
  });
});

//Eliminar.
app.get("/eliminar", (req, res) => {
  const { nombre } = req.query;
  //Leer el archivo Json.
  fs.readFile('deportes.json', 'utf8', (err, data) => {
     try {
      let deportes = JSON.parse(data);
      //Almacenar deporte a eliminar.
      let deporteEliminado = deportes.filter(d => d.nombre !== nombre);
      //Actualizar el archivo JSON
      fs.writeFile('deportes.json', JSON.stringify(deporteEliminado, null, 2), err => {
        res.send('Deporte eliminado correctamente. 👍');
      });
      //Control de errores.
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Hubo un error al borrar');
    }
  });
});
