FROM nginx:alpine

RUN mkdir -p /etc/nginx/ssl

COPY default.conf /etc/nginx/conf.d/default.conf

COPY jasun.xyz_certificate.pem /etc/nginx/ssl/
COPY jasun.xyz_private.key /etc/nginx/ssl/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
