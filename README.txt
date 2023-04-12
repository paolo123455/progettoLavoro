SERVER DOCKER: 10.121.172.33
UTENTE: docker
PASSWORD: A1m4W4v3@DCK01

PERCORSO: /home/docker/Anac/project_review/web_app

Il file nginx-custom.conf va dentro la cartella conf

Un volta caricati i file nella macchina aggiornare l'immagine ed eseguire nuovamente il container:
    docker-compose down
    docker-compose build <<client/server>>
per entrambi i servizi: docker-compose build
    docker-compose up -d
