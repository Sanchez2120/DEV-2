<div align="center">

# 🚀 Asisya – Sistema de Gestión de Inventario

### Prueba Técnica Senior Developer II

**Full-Stack · .NET 10 + React 19 · Clean Architecture · PostgreSQL · Docker**

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![xUnit](https://img.shields.io/badge/Tests-5%2F5_passing-green?logo=dotnet)

</div>

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Stack Tecnológico y Versiones](#2-stack-tecnológico-y-versiones)
3. [Arquitectura Limpia](#3-arquitectura-limpia)
4. [Modelo de Base de Datos – Northwind Completo](#4-modelo-de-base-de-datos--northwind-completo)
5. [Instalación y Ejecución](#5-instalación-y-ejecución)
6. [Endpoints REST – Referencia Completa](#6-endpoints-rest--referencia-completa)
7. [Autenticación JWT](#7-autenticación-jwt)
8. [Carga Masiva de 100.000 Productos](#8-carga-masiva-de-100000-productos)
9. [Caché](#9-caché)
10. [Rate Limiting y Seguridad](#10-rate-limiting-y-seguridad)
11. [Manejo Global de Errores](#11-manejo-global-de-errores)
12. [Frontend (React SPA)](#12-frontend-react-spa)
13. [Pruebas Unitarias e Integración](#13-pruebas-unitarias-e-integración)
14. [DevOps – Docker y Docker Compose](#14-devops--docker-y-docker-compose)
15. [CI/CD – GitHub Actions](#15-cicd--github-actions)
16. [Escalabilidad Horizontal en Cloud](#16-escalabilidad-horizontal-en-cloud)
17. [Credenciales y Datos Iniciales](#17-credenciales-y-datos-iniciales)

---

## 1. Visión General

Asisya es una API REST + SPA web de gestión de inventario desarrollada como prueba técnica para el puesto de **Senior Developer II**. El sistema permite:

- Gestionar productos y categorías con operaciones CRUD completas
- Cargar hasta **100,000 productos de forma eficiente** mediante batch inserts
- Autenticar usuarios con **JWT** y proteger endpoints críticos
- Subir imágenes de categorías con validación de formato y tamaño
- Visualizar en interfaz React con dashboard de estadísticas en tiempo real

---

## 2. Stack Tecnológico y Versiones

### Backend

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | **ASP.NET Core** | 10.0 |
| Lenguaje | **C#** | 13 |
| ORM | Entity Framework Core | 10.0.x |
| Base de datos driver | Npgsql (EF PostgreSQL) | 10.0.x |
| Autenticación | Microsoft.IdentityModel.Tokens (JWT Bearer) | 10.0.x |
| Hash contraseñas | BCrypt.Net-Next | 4.0.x |
| Documentación API | Swashbuckle (Swagger/OpenAPI) | 7.3.x |
| Caché | IMemoryCache (ASP.NET Core nativo) | 10.0.x |
| Rate Limiting | ASP.NET Core RateLimiter (nativo) | 10.0.x |

### Frontend

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | **React** | 19 |
| Lenguaje | **TypeScript** | 5.x |
| Build tool | Vite | 7.x |
| Enrutamiento | React Router DOM | 7.x |
| HTTP Client | Axios | 1.x |
| Iconos | Lucide React | latest |
| Formularios | React Hook Form | 7.x |

### Infraestructura

| Componente | Tecnología | Versión |
|---|---|---|
| Base de datos | **PostgreSQL** | 16-alpine |
| Contenedores | Docker + Docker Compose | 24+ |
| Servidor web frontend | Nginx | alpine |
| CI/CD | GitHub Actions | — |

---

## 3. Arquitectura Limpia

El backend implementa **Clean Architecture basada en capas** con separación estricta de responsabilidades:

```
📦 backend/
├── Asisya.Domain/           → Entidades del negocio (sin dependencias externas)
│   ├── Product.cs
│   ├── Category.cs
│   ├── Supplier.cs
│   ├── Customer.cs
│   ├── Employee.cs
│   ├── Shipper.cs
│   ├── Order.cs
│   ├── OrderDetail.cs
│   └── User.cs
│
├── Asisya.Application/      → Interfaces, DTOs, contratos de servicios
│   ├── DTOs/                → Objetos de transferencia de datos
│   └── Interfaces/          → IProductRepository, ICategoryRepository...
│
├── Asisya.Infrastructure/   → Implementaciones: EF Core, JWT, BCrypt, Cache
│   ├── Data/                → AppDbContext, DbSeeder, Migrations
│   ├── Repositories/        → ProductRepository, CategoryRepository
│   └── Auth/                → JwtProvider, AuthService
│
├── Asisya.Api/              → Controllers REST, Middleware, Swagger, Program.cs
│   ├── Controllers/
│   └── Middleware/
│
└── Asisya.Tests/            → xUnit + Moq + EF InMemory
```

### Decisiones Arquitectónicas

| Decisión | Justificación |
|---|---|
| **DTOs explícitos** | Nunca se exponen entidades de BD directamente. Mapeo manual entre capas. |
| **Repository Pattern** | Abstrae EF Core. Facilita unit testing con mocks sin tocar la BD. |
| **IMemoryCache en categorías** | Reducir latencia y carga en PostgreSQL en endpoints de alta lectura. |
| **Batch inserts de 1,000** | Insertar 100,000 en un solo SaveChanges consume toda la RAM y genera timeouts. Batches pequeños son más resilientes. |
| **`ImageUrl` en BD en vez de Blob** | Guardar binarios en PostgreSQL no escala. Almacenamos la imagen en `wwwroot/images/categories/` y guardamos solo la URL. |
| **JWT stateless** | El servidor no guarda sesión. Cualquier réplica puede validar el token. |
| **GlobalExceptionHandler** | Toda excepción no manejada retorna JSON consistente. Nunca stack traces en producción. |
| **Rate Limiting nativo** | Sin librerías externas. 10 req/min en `/auth/login` contra brute-force. |

---

## 4. Modelo de Base de Datos – Northwind Completo

### Diagrama de relaciones

```
Suppliers ──────────< Products >───────────── Categories
                          │
                    OrderDetails >──────────── Orders
                                                  │
                              ┌───────────────────┼──────────────────┐
                           Customers          Employees           Shippers

Users (Autenticación del sistema)
```

### Esquema detallado

#### `Categories`
| Campo | Tipo | Restricción |
|---|---|---|
| CategoryID | int | PK, Identity |
| CategoryName | varchar(100) | NOT NULL, Unique |
| Description | text | nullable |
| ImageUrl | varchar(500) | nullable – URL de imagen subida vía API |

> **Nota:** El esquema Northwind original define `Picture (Bytea/Blob)`. Esta implementación usa `ImageUrl` (URL a fichero en disco) por ser la práctica moderna correcta: no se deben guardar binarios en columnas de BD relacional.

#### `Products`
| Campo | Tipo | Restricción |
|---|---|---|
| ProductID | int | PK, Identity |
| ProductName | varchar(200) | NOT NULL |
| SupplierID | int | FK → Suppliers |
| CategoryID | int | FK → Categories, NOT NULL |
| QuantityPerUnit | varchar(100) | nullable |
| UnitPrice | decimal(18,2) | NOT NULL |
| UnitsInStock | int | NOT NULL |
| UnitsOnOrder | int | NOT NULL |
| ReorderLevel | int | NOT NULL |
| Discontinued | boolean | NOT NULL |
| Description | text | nullable |
| ImageUrl | varchar(500) | nullable |

#### `Suppliers`
| Campo | Tipo |
|---|---|
| SupplierID | int PK |
| CompanyName | varchar(100) NOT NULL |
| ContactName, ContactTitle | varchar(100) |
| Address, City, Region, PostalCode, Country | varchar |
| Phone, Fax | varchar(30) |
| HomePage | varchar(200) |

#### `Employees`
| Campo | Tipo |
|---|---|
| EmployeeID | int PK |
| LastName, FirstName | varchar(50) NOT NULL |
| Title, TitleOfCourtesy | varchar(100) |
| BirthDate, HireDate | timestamp |
| Address, City, Region, PostalCode, Country | varchar |
| HomePhone, Extension | varchar |
| Photo | varchar (URL) |
| Notes | text |
| ReportsTo | int (self-referencing FK) |

#### `Customers`
| Campo | Tipo |
|---|---|
| CustomerID | char(5) PK |
| CompanyName | varchar(100) NOT NULL |
| ContactName, ContactTitle | varchar(100) |
| Address, City, Region, PostalCode, Country | varchar |
| Phone, Fax | varchar(30) |

#### `Shippers`
| Campo | Tipo |
|---|---|
| ShipperID | int PK |
| CompanyName | varchar(100) NOT NULL |
| Phone | varchar(30) |

#### `Orders`
| Campo | Tipo |
|---|---|
| OrderID | int PK |
| CustomerID | FK → Customers |
| EmployeeID | FK → Employees |
| ShipVia (ShipperId) | FK → Shippers |
| OrderDate, RequiredDate, ShippedDate | timestamp |
| Freight | decimal(18,2) |
| ShipName, ShipAddress, ShipCity | varchar |
| ShipRegion, ShipPostalCode, ShipCountry | varchar |

#### `Order Details`
| Campo | Tipo |
|---|---|
| OrderID | PK + FK → Orders |
| ProductID | PK + FK → Products |
| UnitPrice | decimal(18,2) |
| Quantity | smallint |
| Discount | float |

> PK compuesta: `(OrderID, ProductID)`

#### `Users` (Autenticación)
| Campo | Tipo |
|---|---|
| Id | int PK |
| Email | varchar NOT NULL, Unique |
| PasswordHash | varchar (BCrypt) |
| Name | varchar |

---

## 5. Instalación y Ejecución

### ✅ Opción A – Docker (recomendado)

**Requisito único:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/asisya-dev2.git
cd asisya-dev2

# 2. Levantar todos los servicios
docker compose up --build
```

| Servicio | URL | Descripción |
|---|---|---|
| 🌐 Frontend | http://localhost:3000 | SPA React |
| 🔌 API | http://localhost:5000 | ASP.NET Core REST |
| 📄 Swagger | http://localhost:5000/swagger | Documentación interactiva |
| 🐘 PostgreSQL | localhost:5432 | Base de datos |

> **Al iniciar**, el backend aplica automáticamente todas las migraciones EF Core y siembra los datos iniciales (usuario admin, categorías SERVIDORES y CLOUD, productos de muestra).

> **💾 Persistencia de Datos:** Toda la información que se ingrese en el sistema (productos, categorías, usuarios, órdenes) se guarda de forma segura y **permanente** en la base de datos PostgreSQL. Gracias al volumen Docker `pg_data`, los datos no se pierden aunque se apaguen o reinicien los contenedores.

---

### ⚙️ Opción B – Sin Docker (desarrollo local)

**Requisitos:**
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 20 LTS](https://nodejs.org/)
- [PostgreSQL 16](https://www.postgresql.org/download/)

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/asisya-dev2.git
cd asisya-dev2

# 2. Crear base de datos
psql -U postgres -c "CREATE DATABASE asisya;"

# 3. Backend (terminal 1)
cd backend
dotnet run --project Asisya.Api
# → API en http://localhost:5000

# 4. Frontend (terminal 2)
cd frontend
npm install
npm run dev
# → App en http://localhost:5173
```

---

### Variables de entorno – Backend

`backend/Asisya.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db;Port=5432;Database=asisya;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "SecretKey": "tu-clave-secreta-minimo-256-bits-aqui",
    "Issuer": "asisya-api",
    "Audience": "asisya-frontend",
    "ExpirationMinutes": 60
  }
}
```

---

## 6. Endpoints REST – Referencia Completa

> ✅ = Requiere `Authorization: Bearer {token}` | ❌ = Público

---

### 🔐 Autenticación — `/api/auth`

#### `POST /api/auth/login`
Obtiene un JWT. **Rate limit: 10 peticiones/minuto por IP.**

**Request:**
```json
{
  "email": "admin@asisya.com",
  "password": "Admin123!"
}
```
**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "name": "admin@asisya.com"
}
```
**Response `401`:**
```json
{ "message": "Credenciales inválidas." }
```
**Response `429`:**
```json
{ "detail": "Too Many Requests" }
```

---

### 📦 Productos — `/api/product`

#### `GET /api/product` ✅
Listado paginado con búsqueda y filtros.

**Query params:**

| Param | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | int | 1 | Número de página |
| `pageSize` | int | 10 | Resultados por página |
| `search` | string | — | Búsqueda por nombre (case-insensitive) |
| `categoryId` | int | — | Filtrar por categoría |

**Response `200`:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Servidor Dell PowerEdge R750",
      "description": "Servidor de alto rendimiento",
      "price": 15000.00,
      "stock": 25,
      "categoryId": 1,
      "categoryName": "SERVIDORES",
      "supplierId": null
    }
  ],
  "totalCount": 100000,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10000
}
```

---

#### `GET /api/product/{id}` ✅
Detalle de producto. **Incluye la foto de la categoría.**

**Response `200`:**
```json
{
  "id": 1,
  "name": "Servidor Dell PowerEdge R750",
  "price": 15000.00,
  "stock": 25,
  "categoryId": 1,
  "categoryName": "SERVIDORES",
  "categoryImageUrl": "/images/categories/category_1_abc123.jpg"
}
```

---

#### `POST /api/product` ✅
Crear un producto individual.

**Request:**
```json
{
  "name": "Switch Cisco Catalyst 9300",
  "description": "Switch empresarial 48 puertos",
  "price": 3500.00,
  "stock": 10,
  "categoryId": 1,
  "supplierId": 1,
  "quantityPerUnit": "1 unidad",
  "unitsOnOrder": 0,
  "reorderLevel": 5,
  "discontinued": false
}
```

---

#### `POST /api/product/bulk` ✅
**Inserción masiva eficiente.** Acepta arrays de cualquier tamaño (probado con 100,000).

**Estrategia internamente:** batches de 1,000 registros por transacción.

**Request:**
```json
[
  { "name": "Producto 1", "price": 100, "stock": 50, "categoryId": 1 },
  { "name": "Producto 2", "price": 200, "stock": 30, "categoryId": 2 },
  "...hasta 100,000 objetos..."
]
```
**Response `200`:**
```json
{ "message": "100000 productos insertados correctamente." }
```

---

#### `PUT /api/product/{id}` ✅
Actualizar producto existente. Misma estructura que POST.

---

#### `DELETE /api/product/{id}` ✅
Eliminar producto.

**Response `204`:** Sin contenido.
**Response `404`:** Producto no encontrado.

---

### 🏷️ Categorías — `/api/category`

#### `GET /api/category` ❌
Listar todas las categorías. **Respuesta cacheada 10 minutos.**

**Response `200`:**
```json
[
  { "id": 1, "name": "SERVIDORES", "description": "Servidores físicos", "imageUrl": "/images/categories/..." },
  { "id": 2, "name": "CLOUD", "description": "Servicios cloud", "imageUrl": null }
]
```

---

#### `GET /api/category/{id}` ❌
Detalle de categoría con imagen.

---

#### `POST /api/category` ✅
Crear categoría. **Este endpoint se usa para crear las categorías obligatorias SERVIDORES y CLOUD.**

**Request:**
```json
{ "name": "SERVIDORES", "description": "Servidores físicos y blade" }
```

---

#### `POST /api/category/{id}/image` ✅
Subir imagen para una categoría.

- **Content-Type:** `multipart/form-data`
- **Campo:** `file`
- **Formatos permitidos:** `JPG`, `JPEG`, `PNG`, `GIF`, `WEBP`, `SVG`
- **Tamaño máximo:** 5 MB

```bash
curl -X POST http://localhost:5000/api/category/1/image \
  -H "Authorization: Bearer {token}" \
  -F "file=@/ruta/a/imagen.jpg"
```

**Response `200`:**
```json
{ "imageUrl": "/images/categories/category_1_uuid.jpg", "message": "Imagen subida exitosamente." }
```

---

## 7. Autenticación JWT

### Flujo completo

```
1. POST /api/auth/login  →  { email, password }
2. Servidor valida credenciales con BCrypt
3. Servidor genera JWT firmado (HMAC-SHA256)
4. Cliente recibe el token
5. Cliente incluye en cada petición:
     Authorization: Bearer eyJhbGciOiJIUzI1N...
6. Middleware [Authorize] valida firma, issuer, audience y expiración
7. Si inválido → 401 Unauthorized
```

### Configuración del token

| Parámetro | Valor |
|---|---|
| Algoritmo | HMAC-SHA256 |
| Issuer | `asisya-api` |
| Audience | `asisya-frontend` |
| Expiración | 60 minutos |

### 🛠️ Cómo obtener y usar el Token JWT (3 Opciones)

#### Opción 1: Swagger (Recomendado)
1. Abre **http://localhost:5000/swagger**
2. Busca `POST /api/auth/login`, clic en **Try it out**
3. Ejecuta con: `{ "email": "admin@asisya.com", "password": "Admin123!" }`
4. Copia el `token` de la respuesta.
5. Sube y haz clic en el botón **Authorize** 🔒
6. Escribe `Bearer eyJ...` (el token copiado) y haz clic en Authorize.
7. ¡Listo! Ya puedes probar cualquier endpoint protegido.

#### Opción 2: cURL (Terminal)
```bash
# 1. Obtener el token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@asisya.com","password":"Admin123!"}'

# 2. Usar el token (reemplaza {TOKEN})
curl -X GET http://localhost:5000/api/product \
  -H "Authorization: Bearer {TOKEN}"
```

#### Opción 3: Postman / Insomnia
1. Petición `POST http://localhost:5000/api/auth/login` con el JSON en el Body.
2. Copia el `token` devuelto.
3. En la siguiente petición, ve a la pestaña **Authorization**.
4. Selecciona **Bearer Token** y pega el token.

---

## 8. Carga Masiva de 100.000 Productos

### Endpoint
```http
POST /api/product/bulk
Authorization: Bearer {token}
Content-Type: application/json
```

### Implementación interna – Batch Insert

```csharp
const int batchSize = 1000;
for (int i = 0; i < products.Count; i += batchSize)
{
    var batch = products.Skip(i).Take(batchSize).ToList();
    _context.Products.AddRange(batch);
    await _context.SaveChangesAsync(); // Commit por cada lote de 1,000
}
```

**¿Por qué lotes de 1,000 y no de 100,000 en un solo commit?**

| Aspecto | Un solo SaveChanges (100k) | Batch de 1,000 |
|---|---|---|
| Memoria RAM | ❌ Muy alto consumo | ✅ Controlado |
| Tiempo de transacción | ❌ Minutos / timeout | ✅ Segundos por lote |
| Resiliencia | ❌ Falla todo si hay 1 error | ✅ Solo falla el lote afectado |
| Bloqueos en BD | ❌ Lock prolongado en la tabla | ✅ Locks cortos y frecuentes |

### Ejemplo con curl

```bash
# Generar 100,000 productos y enviarlos en un solo request
# (el servidor los procesa en 100 lotes internamente)
curl -X POST http://localhost:5000/api/product/bulk \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '[{"name":"Prod-1","price":100,"stock":10,"categoryId":1}, ...]'
```

---

## 9. Caché

Se implementa `IMemoryCache` de ASP.NET Core (sin dependencias externas adicionales):

| Recurso cacheado | TTL | Invalidación |
|---|---|---|
| `GET /api/category` | **10 minutos** | Al crear categoría o actualizar imagen |

```csharp
// Lectura con cache-aside pattern
if (_cache.TryGetValue("categories_all", out var cached))
    return cached;

var fresh = await _context.Categories.Select(...).ToListAsync();
_cache.Set("categories_all", fresh, TimeSpan.FromMinutes(10));
```

**Para producción con múltiples instancias**, reemplazar `IMemoryCache` por `IDistributedCache` + Redis:
```csharp
services.AddStackExchangeRedisCache(opt => {
    opt.Configuration = "redis:6379";
});
```

---

## 10. Rate Limiting y Seguridad

### Rate Limiting
- **Endpoint:** `POST /api/auth/login`
- **Límite:** 10 peticiones por minuto por IP
- **Respuesta al superar:** `HTTP 429 Too Many Requests`
- **Implementación:** ASP.NET Core `RateLimiter` nativo (sin librerías externas)

### Endpoints protegidos con `[Authorize]`
- Todos los endpoints de `/api/product/*`
- `POST /api/category`
- `POST /api/category/{id}/image`

### Endpoints públicos
- `POST /api/auth/login`
- `GET /api/category`
- `GET /api/category/{id}`

---

## 11. Manejo Global de Errores

Middleware `GlobalExceptionHandler` intercepta toda excepción no manejada y retorna JSON consistente:

```json
{
  "status": 500,
  "error": "Ocurrió un error interno. Inténtalo más tarde.",
  "path": "/api/product/bulk"
}
```

| Excepción | HTTP | Mensaje |
|---|---|---|
| `UnauthorizedAccessException` | 401 | No autorizado |
| `KeyNotFoundException` | 404 | Recurso no encontrado |
| `ArgumentException` | 400 | Mensaje del error |
| Cualquier otra | 500 | Mensaje genérico (sin stack trace) |

---

## 12. Frontend (React SPA)

### Arquitectura frontend

```
src/
├── api/              → Llamadas HTTP (Axios) por dominio
│   ├── auth.ts
│   ├── products.ts
│   └── categories.ts
├── components/
│   ├── Sidebar.tsx   → Navegación lateral
│   └── AuthGuard.tsx → PrivateRoute / PublicRoute
├── context/
│   └── AuthContext.tsx → Estado global de autenticación
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   └── ProductFormPage.tsx
├── types/index.ts    → Interfaces TypeScript
└── main.tsx
```

### Flujo de autenticación frontend

```
1. Usuario entra a /login
2. LoginPage llama a POST /api/auth/login
3. Token guardado en localStorage: localStorage.setItem('token', token)
4. Interceptor Axios inyecta el header en cada request:
     config.headers.Authorization = `Bearer ${token}`
5. AuthGuard (PrivateRoute) verifica token antes de renderizar rutas
6. Si token ausente → redirect a /login
```

### Funcionalidades implementadas

| Pantalla | Descripción |
|---|---|
| **Dashboard** | Estadísticas: total productos, categorías, stock bajo |
| **Listado de productos** | Tabla paginada con búsqueda y filtro por categoría |
| **Crear producto** | Formulario con validaciones (nombre requerido, precio > 0, stock ≥ 0) |
| **Editar producto** | Pre-carga datos actuales del producto |
| **Eliminar producto** | Confirmación antes de borrar |

---

## 13. Pruebas Unitarias e Integración (E2E)

```bash
cd backend
dotnet test
```

**Resultado esperado:**
```
Test summary: total: 8, failed: 0, succeeded: 8, skipped: 0
```

### Tests incluidos

| Test | Tipo | Cobertura |
|---|---|---|
| `LoginAsync_ValidCredentials_ReturnsToken` | **Unitario** | Flujo happy path de login |
| `LoginAsync_WrongPassword_ThrowsUnauthorized` | **Unitario** | Contraseña incorrecta |
| `LoginAsync_UserNotFound_ThrowsUnauthorized` | **Unitario** | Usuario no existe |
| `GetPagedAsync_ReturnsPaginatedResults` | **Integración** | Paginación real con EF InMemory |
| `BulkInsertAsync_InsertsAllProducts` | **Integración** | Inserción masiva en lotes |
| `CreateProduct_WithoutToken_ReturnsUnauthorized` | **E2E (Integración)** | Verifica protección JWT (HTTP 401) |
| `CreateProduct_WithValidToken_ReturnsCreated` | **E2E (Integración)** | Verifica inyección de JWT por header |
| `GetCategories_IsPublic_ReturnsOkWithoutToken` | **E2E (Integración)** | Verifica endpoints `[AllowAnonymous]` |

### Herramientas de Testing

| Herramienta | Uso |
|---|---|
| **xUnit** | Framework de tests |
| **Moq** | Mocks de repositorios e interfaces |
| **WebApplicationFactory** | Servidor web en memoria para pruebas E2E HTTP Reales |
| **EF Core InMemory** | Base de datos en memoria para integración |

---

## 14. DevOps – Docker y Docker Compose

### Servicios en `docker-compose.yml`

```yaml
services:
  db:        # PostgreSQL 16-alpine — puerto 5432
  backend:   # ASP.NET Core 10 — puerto 5000
  frontend:  # Nginx Alpine sirviendo el build de React — puerto 3000
```

### Healthchecks
- `db`: `pg_isready` cada 5 segundos
- `backend`: depende de `db` (condition: `service_healthy`)
- `frontend`: depende de `backend` (condition: `service_started`)

### Comandos útiles

```bash
# Levantar todo
docker compose up --build

# Solo backend y base de datos (sin frontend)
docker compose up db backend

# Ver logs del backend
docker compose logs -f backend

# Resetear base de datos (borra datos)
docker compose down -v && docker compose up --build

# Ejecutar tests dentro del contenedor
docker compose run --rm backend dotnet test
```

---

## 15. CI/CD – GitHub Actions

Pipeline en `.github/workflows/ci.yml` que se ejecuta en cada push a `main` y en Pull Requests:

```
Push → main
    │
    ├─ Job: backend
    │    ├── dotnet restore
    │    ├── dotnet format --verify-no-changes  ← Validación de estilo
    │    ├── dotnet build -c Release
    │    ├── dotnet test
    │    └── docker build (validación de imagen)
    │
    └─ Job: frontend
         ├── npm ci
         ├── npm run lint  ← ESLint
         ├── npm run build  ← TypeScript + Vite
         └── docker build (validación de imagen)
```

---

## 16. Escalabilidad Horizontal en Cloud

### Arquitectura objetivo en Kubernetes

```
                          ┌──────────────────────────────┐
Internet → Load Balancer  │  Kubernetes Cluster           │
(AWS ALB / NGINX Ingress) │                               │
          │               │  ┌─── Backend Pod 1 ────┐    │
          └──────────────►├──│  ASP.NET Core         │    │
                          │  └──────────────────────┘    │
                          │  ┌─── Backend Pod 2 ────┐    │
                          │──│  ASP.NET Core         │    │
                          │  └──────────────────────┘    │
                          │  ┌─── Backend Pod N ────┐    │
                          │──│  HPA: auto-scale      │    │
                          │  └──────────────────────┘    │
                          └──────────┬───────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                 ▼
             PostgreSQL          Redis Cache      Object Storage
             (Primary +        (IDistributed      (S3 para
             Read Replica)        Cache)           imágenes)
```

### Estrategias de escalabilidad

| Capa | Estrategia |
|---|---|
| **API** | JWT stateless → cualquier pod valida el token sin coordinación |
| **Caché** | Migrar de `IMemoryCache` a Redis con `StackExchange.Redis` |
| **BD** | PgBouncer como connection pooler + read replicas para consultas |
| **Imágenes** | Migrar almacenamiento a Amazon S3 o Azure Blob Storage |
| **Auto-scaling** | Kubernetes HPA basado en CPU/memoria o peticiones/segundo |
| **CI/CD** | GitHub Actions → Docker Hub → Argo CD / Kubernetes rolling deploy |

### Por qué esta arquitectura escala

1. **Stateless**: No hay estado de sesión en el servidor. Nuevas instancias arrancan sin calentamiento.
2. **Cache distribuida**: Redis permite que múltiple pods compartan el mismo cache.
3. **Connection pooling**: PgBouncer reutiliza conexiones a PostgreSQL, reduciendo overhead.
4. **Read replicas**: Las consultas de lectura (`GET /products`) se dirigen a réplicas, aliviando el primary.

---

## 17. Credenciales y Datos Iniciales

Los siguientes datos se crean automáticamente al iniciar la aplicación (sin intervención manual):

### Usuario administrador
| Campo | Valor |
|---|---|
| Email | `admin@asisya.com` |
| Contraseña | `Admin123!` |

### Categorías creadas automáticamente
| ID | Nombre | Descripción |
|---|---|---|
| 1 | `SERVIDORES` | Servidores físicos y blade |
| 2 | `CLOUD` | Servicios de computación en la nube |
| 3 | `NETWORKING` | Equipos de red y conectividad |
| 4 | `STORAGE` | Sistemas de almacenamiento y backup |

### Productos de muestra
8 productos iniciales distribuidos entre las 4 categorías, listos para probar paginación y filtros.
