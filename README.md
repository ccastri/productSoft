# LaptopsInventory

This demo has been created in regards of a technical interview as a frontend developer

It's main purpose is to demonstrate basic understanding of angular as a JavaScript framework for apps development.

In this case the client was requesting a frontend app in which no backend was required and instead a serverless option as firebase was preferred.
They requested for their app to be able of signing into the app (In this case firebase authentication services were employed).
Para el login, los paths de /login y /registro contienen los formularios para inicio de sesion y/o registro de nuevos ususarios.
Once the were login, they wanted to be able to see their catalog (Which is located in one of the child roots of the dashboard: inventario).

Para el manejo del inventario el servicio de firestore fue empleado y con él se diseñó una base de datos NoSQL donde hasta el momento se almacena la coleccion de usuarios y los productos en inventario. el path de /dashboard/products tiene toda la informacion asociada al inventario

Adicionalmente el servicio de productos permite la comunicacion entre el componente sericio de productos, los eventos disparados por el usuario a traves del html y la informacion almacenada en las colecciones y documentos almacenados en firebase

Además de poder ver el stock se requiere poder añadir o descontar unidades a los elementos en stock

Se debe tener la opción de añadir nuevos productos a la lista de stock con un formulario para desempeñar esta funcion

En una pantalla de facturación manejada por cart.component.ts, invoice.service.ts y products.service.ts se debe añadir uno o mas productos a la lista de productos a facturar.

Finalmente el sistema ha sido desplegado a traves de firebase hosting y el base_url del app-root se encuentra en https://productsoft-52eb0.web.app/
Actualmente se está trabajando en un modal de confirmacion para mandar la factura a una nueva coleccion de facturas de ordenes en curso que puedan renderizarse en la pagina del dashboard

# Modulos
Actualmente cuenta con los siguientes modulos:
- Auth: registro y login
- Shared: sidebar (header y footer opcionales)
- Components: componentes reusables como el loader o el modal de confirmacion
- Firebase: configuracion para el uso de los diferentes microservicios (autenticacion, almacenamiento, despliegue)
- Guards: protegen las rutas y restringen la carga perezosa de la informacion de la app hasta que haya una autenticacion exitosa 
- Pages: en el encontramos la mayoria de modulos. el modulo de facturacion, el modulo del inventario, el dashboard y la carga perezosa implementada en las rutas hijas son los puntos a resaltar
- Pipes: para dar formato de moneda y redirigir la busqueda del path de las imagenes a los assets
Services: el servicio de productos para manejar la logica de la data del inventario, invoice para manejar la logica de facturacion y user para manejar la autenticacion de los usuarios con firebase

# Rutas
Login:
https://productsoft-52eb0.web.app/login
Registro:
https://productsoft-52eb0.web.app/register
Principal:
https://productsoft-52eb0.web.app/dashboard
## Rutas hijas:
https://productsoft-52eb0.web.app/dashboard/products
https://productsoft-52eb0.web.app/dasboard/orders
https://productsoft-52eb0.web.app//dashboard/cart

**Se esta trabajando en el modal de confirmación y subida de imagenes para fotos de perfil y/o de los productos
**Además un filtro de busqueda para el inventario y la futura coleccion de facturas

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
