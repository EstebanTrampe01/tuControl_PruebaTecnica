# tuControl_PruebaTecnica

Para inicar el Proyecto usar estos comandos:

## Construir e iniciar los 3 servicios o levantarlo en segundo plano

docker compose up --build

docker compose up --build -d

## Ver estado de contenedores

docker compose ps

## Ver logs de todos

docker compose logs -f

# Ver logs solo de un servicio

docker compose logs -f db
docker compose logs -f backend
docker compose logs -f frontend

## Apagar todo
docker compose down

## Apagar y borrar volumen de postgres 
docker compose down -v

## URLs esperadas:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432