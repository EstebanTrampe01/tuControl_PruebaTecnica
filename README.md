# tuControl_PruebaTecnica 

### JUAN ESTEBAN CHACÓN TRAMPE

---


## ACCEDER AL SITIO DESPLEGADO:

https://novatech-frontend-757428235694.us-central1.run.app/

## GUIA PARA LEVANTARLO DE FORMA LOCAL


### Construir e iniciar los 3 servicios o levantarlo en segundo plano

docker compose up --build

docker compose up --build -d

### Ver estado de contenedores

docker compose ps

### Ver logs de todos

docker compose logs -f

### Ver logs solo de un servicio

docker compose logs -f db
docker compose logs -f backend
docker compose logs -f frontend

### Apagar todo
docker compose down

### Apagar y borrar volumen de postgres 
docker compose down -v

### URLs esperadas:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

### Probar test uniratios en el backend
Si se deesa correcer test unitarios, es necesario que los conetenodres del docker ya esten corriendo bien, este comando se encargar de jalar pnpm test dentro del contenedor del backend para correr las pruebas unitarias con Jest

docker compose exec backend pnpm test