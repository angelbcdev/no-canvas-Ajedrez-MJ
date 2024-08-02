# Ajedrez Multijugador en Línea

## Descripción

Este es un juego de ajedrez multijugador en línea que permite a los jugadores competir en partidas en tiempo real. La aplicación permite a los jugadores emparejarse con otros jugadores en salas, mientras que los demás usuarios pueden unirse como espectadores y participar enviando mensajes en el chat de la partida.

## Tecnologías Usadas

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **WebSocket**: Socket.IO

<div align="center">
        <a href="https://github.com/54albert54" target="_blank" rel="author">
          <img width="110" src="https://avatars.githubusercontent.com/u/126289455?v=4"/>
        </a>
          <h4 style="margin-top: 1rem;">Angel Bernechea</h4>
          <h5 style="margin-top: 1rem;">Front End -- Back End</h5>
        <!-- <a href="https://github.com/54albert54" target="_blank">
          <img src="https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=172B4D&logo=GitHub&logoColor=FFFFFF&label="/>
        </a> -->
        <a href="https://www.linkedin.com/in/angel-bernechea/" target="_blank">
          <img src="https://img.shields.io/badge/linkedin%20-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white"/>
        </a>
      </div>


[Pagina Web](https://multjugador-jedrez.onrender.com/)

## Características

- **Emparejamiento en Salas**: Los jugadores pueden emparejarse con otros jugadores en salas específicas para competir.
- **Modo Espectador**: Los usuarios que no están en una partida pueden unirse como espectadores y enviar mensajes en el chat de la partida.
- **Interacción en Tiempo Real**: Utiliza Socket.IO para comunicación en tiempo real tanto para el juego como para el chat.

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- npm (o yarn)

## Clonar el Repositorio

``` 
git clone https://github.com/tuusuario/ajedrez-multijugador.git
cd ajedrez-multijugador  
```
## Configuración del Frontend
1.  Navega al directorio del frontend:


```
cd client
```
2. Instala las dependencias:

```
npm install
```
3. Configura las variables de entorno:

> Crea un archivo .env en el directorio client con la configuración necesaria. Ejemplo:


``` 
REACT_APP_API_URL=http://localhost:5000
```
4. Inicia el servidor de desarrollo:


```
npm start
```
## Configuración del Backend
1. Navega al directorio del backend:


```
cd server
```
2. Instala las dependencias:


```
npm install
```
4. Configura las variables de entorno:

>Crea un archivo .env en el directorio server con la configuración necesaria. Ejemplo:


```
PORT=5000
```
5. Inicia el servidor:

```
npm start
```
# Uso
- Accede al juego: Abre tu navegador y navega a http://localhost:3000 para el frontend.

- Crear o Unirte a una Sala: Puedes crear una nueva sala o unirte a una existente para jugar al ajedrez.

- Interacción en el Chat: Los espectadores y jugadores pueden interactuar a través del chat en la interfaz del juego.

- Jugar al Ajedrez: Los jugadores en una sala pueden jugar entre sí, mientras que los espectadores pueden observar y participar en el chat.

## Contribuciones
Las contribuciones son bienvenidas. Si quieres contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (git checkout -b feature/nueva-caracteristica).
3. Realiza tus cambios y haz commits (git commit -am 'Agrega nueva característica').
4. Envía tus cambios (git push origin feature/nueva-caracteristica).
5. Crea una nueva pull request.
## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para detalles.




