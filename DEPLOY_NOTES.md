# Deploy checklist — Grupo Saturno (cPanel + Exim local)

Migración del formulario de contacto al SMTP local del cPanel destino. El SMTP externo de NTY (`s109.nty.uy:465`) da *Connection refused* desde la IP del cPanel, así que se rutea por **Exim local en `localhost:25`** (sin auth, sin TLS). SPF del dominio ya autoriza `+ip4:161.0.125.70`.

## 1. Prep en cPanel destino

- [ ] Crear casilla **`noreply@gruposaturno.uy`** en cPanel (Email Accounts → Create). Es la dirección que usará `From:` — debe existir como buzón real para no caer en spam.
- [ ] Verificar que **`exportaciones@frigorificoflorida.uy`** existe y se entrega (mandar un mail manual de prueba si hay dudas).
- [ ] Verificar SPF del dominio: `dig TXT gruposaturno.uy +short` debe contener `+ip4:161.0.125.70` (o equivalente que autorice la IP del cPanel).

## 2. Backup y deploy

- [ ] **Backup** completo de `public_html/` actual antes de tocar nada (vía File Manager → Compress, o `tar` por SSH).
- [ ] Construir local: `npm run build` (genera `dist/`).
- [ ] Subir el contenido de `dist/` a `public_html/` **preservando** estos directorios si existen en el destino:
  - `public_html/.well-known/` (cert renovals de Let's Encrypt)
  - `public_html/cgi-bin/`
- [ ] **`chmod 600`** al `public_html/.env` para que sólo el user dueño lo lea.
- [ ] Verificar permisos: `public_html/contacto.php` → 644; `public_html/PHPMailer/` → 755 con archivos 644.

## 3. Hardening post-deploy

- [ ] `curl -I https://gruposaturno.uy/.env` → debe devolver **403** (o 404 vía el RedirectMatch del `.htaccess`).
- [ ] `curl -I https://gruposaturno.uy/PHPMailer/src/PHPMailer.php` → debe devolver **403**.
- [ ] `curl -I https://gruposaturno.uy/.htaccess` → debe devolver **403/404**.

## 4. Tests funcionales

### Test 1 — happy path

- [ ] Cargar `https://gruposaturno.uy/` (o la página con el form).
- [ ] Completar todos los campos con datos válidos y enviar.
- [ ] **Esperado:** respuesta JSON `{ok: true}` (DevTools → Network → contacto.php).
- [ ] Verificar que el mail llega a **`exportaciones@frigorificoflorida.uy`**.
- [ ] En el header del mail recibido verificar:
  - `Reply-To:` = el email cargado en el form.
  - `Received-SPF: pass` (o equivalente — `Authentication-Results: spf=pass`).
  - `From:` = `noreply@gruposaturno.uy`.

### Test 2 — honeypot

- [ ] Abrir DevTools → Elements → encontrar el `<input name="website">` (oculto).
- [ ] Quitar el `display:none` / `aria-hidden`, escribir cualquier cosa y enviar.
- [ ] **Esperado:** respuesta `{ok: true}` (200) pero **NO** llega mail a `exportaciones@frigorificoflorida.uy`.

## 5. Diagnóstico si algo falla

- [ ] Editar `public_html/.env` y poner `DEBUG_SMTP=true`.
- [ ] Reproducir el envío fallido.
- [ ] Leer el campo `debug` del JSON de respuesta (incluye log completo de la sesión SMTP).
- [ ] **Restaurar `DEBUG_SMTP=false`** inmediatamente después de diagnosticar (expone detalles del servidor).
- [ ] Revisar también `public_html/error_log` (si existe) y los logs de cPanel.

## 6. Rollback al SMTP externo de NTY

Si hay que volver atrás, **no se toca el código**: sólo el `.env`. Restaurarlo con:

```env
SMTP_HOST=s109.nty.uy
SMTP_PORT=465
SMTP_SECURE=smtps
SMTP_AUTH=true
SMTP_USER=<user nty>
SMTP_PASS=<password nty>
MAIL_FROM=<from compatible con el dominio NTY>
MAIL_FROM_NAME=Grupo Saturno - Web
MAIL_TO=exportaciones@frigorificoflorida.uy
DEBUG_SMTP=false
```

El switch entre modos lo controlan exclusivamente las env vars `SMTP_AUTH` y `SMTP_SECURE`. `contacto.php` queda igual en ambos escenarios.
