# Servicio de envio de emails adoptaunpelud.com

## NOTA

Este servicio es dependiente de la [API](https://github.com/Adoptaunpeludo/backend) de adoptaunpeludo.com

## Descripción

Servicio encargado del envio de emails, se conecta a un broker de mensajes RabbitMQ donde recibe mensajes desde el exchange 'email-request' y que consumirá estos mensajes en las siguientes colas:

- verify-email: Cola encargada de mandar un email de validación con un link para verificar la dirección de email registrada a los usuarios que se registren usando un nombre de usuario, email y contraseña.

- change-password: Cola encargada de mandar un email con un link para cambiar su password si el usuario lo ha olvidado y no puede entrar en la aplicación.

- animal-changed-notification: Cola encargada de mandar un email notificando al usuario que un animal de sus favoritos ha cambiado, este email se genera solo si el animal de sus favoritos cambia mientras el usuario se encuentra offline.

- chat-message: Cola encargada de mandar un email notificando al usuario que tiene mensajes de chat sin leer, este email se genera solo si el usuario recibe un mensaje de chat estando offline.

A su vez este servicio mandará mensajes a un exchange:

- error-notification:  A la cola 'error-logs' para que el servicio NOC se encargue de guardar y notificar a los administradores del error segun su 'level'

## Funcionalidad:

El servicio de envio de emails es el encargado de mandar emails de validacion y de notificaciones a los usuarios según sean solicitados por la API o los distintos servicios que conforman el backend.
Genera templates html dinamicamente según el tipo de email que sea necesario enviar.
Utiliza nodemailer como transporter para el envio de estos emails.

## Instalación

Consultar la documentación de la [API](https://github.com/Adoptaunpeludo/backend) para arrancar este servicio junto a todos los otros usando Docker.

1. Clonar el repo, movernos al directorio e instalar las depencencias:

```
git clone https://github.com/Adoptaunpeludo/email-service
cd email-service
npm i
```

2. Copiar o renombrar el archivo .env.template y configurar con datos propios

```
PORT=<puerto del servicio>

# Nodemailer
MAIL_SERVICE=gmail
MAILER_EMAIL=<direccion email gmail desde donde se mandarán los mensajes>
MAILER_SECRET_KEY=<key app configurada en el email para que nodemailer pueda mandar mensajes desde esa direccion de correo>

# Url Web
WEBSERVICE_URL=<url de la página web para la generación de links>

# RabbitMQ
RABBITMQ_USER=<usuario de rabbitmq>
RABBITMQ_PASS=<password de rabbitmq>
DOCK_RABBITMQ_URL=amqp:<url de rabbitmq estando en el mismo docker-compose>
RABBITMQ_URL=<url para conectar a rabbitmq>
```

3-a. Arrancar la aplicación en modo desarrollo

```
npm run dev
```

3-b. Arrancar la aplicación en modo producción

```
npm run build
npm start
```

**NOTA:** Para que el servido de envio de emails funcione es necesario tener arrancado un servicio de RabbitMQ configurado con los valores del archivo .env
