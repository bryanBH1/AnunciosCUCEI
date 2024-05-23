// Manejar envío del formulario para crear anuncio
document.getElementById('announcementForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener valores del formulario
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    // Agregar anuncio a Firestore
    db.collection('Anuncios').add({
        Titulo: title,
        Mensaje: content,
        FechaCreacion: timestamp
    }).then((docRef) => {
        alert('Anuncio agregado');
    }).catch((error) => {
        alert('Error al agregar anuncio: ' + error.message);
    });
});

// Mostrar lista de anuncios al cargar la página
window.addEventListener('load', () => {
    displayAnnouncements();
});

// Función para mostrar los anuncios
function displayAnnouncements() {
    const announcementList = document.getElementById('announcementList');

    // Limpiar la lista de anuncios antes de volver a mostrar
    announcementList.innerHTML = '';

    // Obtener los anuncios de Firestore
    db.collection('Anuncios').orderBy('FechaCreacion', 'desc').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                <h5 class="mb-1">${data.Titulo}</h5>
                <p class="mb-1">${data.Mensaje}</p>
                <small>${new Date(data.FechaCreacion.toDate()).toLocaleString()}</small>
                <button class="btn btn-sm btn-danger float-right" onclick="deleteAnnouncement('${doc.id}')">Eliminar</button>
                <button class="btn btn-sm btn-primary float-right mr-2" onclick="editAnnouncement('${doc.id}', '${data.Titulo}', '${data.Mensaje}')">Editar</button>
            `;
                announcementList.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error('Error al obtener anuncios: ', error);
        });
}

// Función para eliminar un anuncio específico
function deleteAnnouncement(announcementId) {
    db.collection('Anuncios').doc(announcementId).delete()
        .then(() => {
            alert('Anuncio eliminado');
            displayAnnouncements(); // Actualizar la lista después de eliminar
        })
        .catch((error) => {
            console.error('Error al eliminar anuncio: ', error);
        });
}

// Función para editar un anuncio específico
function editAnnouncement(announcementId, title, content) {
    const newTitle = prompt('Nuevo título:', title);
    const newContent = prompt('Nuevo mensaje:', content);

    if (newTitle !== null && newContent !== null) {
        db.collection('Anuncios').doc(announcementId).update({
            Titulo: newTitle,
            Mensaje: newContent
        })
            .then(() => {
                alert('Anuncio actualizado');
                displayAnnouncements(); // Actualizar la lista después de editar
            })
            .catch((error) => {
                console.error('Error al actualizar anuncio: ', error);
            });
    }
}

// Manejar clic en el botón "Eliminar Todos los Anuncios"
document.getElementById('deleteAllBtn').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los anuncios?')) {
        // Eliminar todos los anuncios de Firestore
        db.collection('Anuncios').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.delete();
                });
                alert('Todos los anuncios han sido eliminados');
                displayAnnouncements(); // Actualizar la lista después de eliminar todos los anuncios
            })
            .catch((error) => {
                console.error('Error al eliminar todos los anuncios: ', error);
            });
    }
});
