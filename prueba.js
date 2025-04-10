// Crear un objeto con los datos del nuevo producto
const newProduct = {
    destino: "wefoiwfwoif" // Este es un ejemplo de un destino que agregarías al esquema
};

// Hacer la solicitud POST usando fetch
fetch('http://localhost:3000/api/products/anadir', {
    method: 'POST', // Usamos el método POST
    headers: {
        'Content-Type': 'application/json', // Especificamos que estamos enviando datos en formato JSON
    },
    body: JSON.stringify(newProduct) // Convertimos el objeto a una cadena JSON para enviarlo
})
    .then(response => response.json()) // Esperamos la respuesta del servidor en formato JSON
    .then(data => {
        console.log("Producto agregado:", data); // Imprimir el producto agregado que recibimos como respuesta
    })
    .catch(error => {
        console.error("Error al agregar el producto:", error); // Si ocurre algún error, lo mostramos
    });