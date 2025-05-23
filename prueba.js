const newProduct = {
    destino: "India",
    imagen: ["https://asmaraviajes.com/wp-content/uploads/2024/09/satyam-bhardwaj-qnO1zuuRN7Q-unsplash-1-scaled.jpg"],
    salida: ["Murcia", "Navarra", "Palencia", "Las Palmas", "Ourense"],
    horariosDeVuelo: ["5:30", "09:25", "10:05"],
    diasDeLaSemana: ["Sábado", "Miércoles", "Domingo", "Viernes"],
    precio: 190,
    numeroDeAsientosAvion: 90,
    numeroDeAsientosRestantes: 90
};

fetch('http://localhost:3000/api/Viajes/add', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct)
})
    .then(response => response.json())
    .then(data => {
        console.log("Producto agregado:", data);
    })
    .catch(error => {
        console.error("Error al agregar el producto:", error);
    });