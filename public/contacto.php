<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function respond(int $code, array $data): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// __DIR__ porque el cwd en cPanel no siempre es el dir del script.
// getenv() prevalece sobre .env: si cPanel inyecta la var, no la pisamos.
$envFile = __DIR__ . '/.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v);
        if ($k !== '' && getenv($k) === false) {
            putenv("$k=$v");
            $_ENV[$k] = $v;
        }
    }
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

// Honeypot: si "website" viene completo, era un bot. Respondemos 200 sin enviar.
if (!empty($_POST['website'] ?? '')) {
    respond(200, ['ok' => true]);
}

$name    = trim($_POST['name']    ?? '');
$company = trim($_POST['company'] ?? '');
$country = trim($_POST['country'] ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');
$langIn  = trim($_POST['lang']    ?? '');

// Lang se descarta silenciosamente si no es uno de los soportados.
$lang = in_array($langIn, ['es', 'en', 'zh'], true) ? $langIn : null;

if ($name === '' || $company === '' || $country === '' || $email === '' || $message === '') {
    respond(400, ['ok' => false, 'error' => 'missing_fields']);
}

$limits = ['name' => 80, 'company' => 120, 'country' => 80, 'email' => 120, 'message' => 3000];
foreach ($limits as $field => $max) {
    if (mb_strlen($$field) > $max) {
        respond(400, ['ok' => false, 'error' => 'too_long']);
    }
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'invalid_email']);
}

// Anti header-injection: CRLF en cualquier campo corto.
if (preg_match('/[\r\n]/', $name . $company . $country . $email)) {
    respond(400, ['ok' => false, 'error' => 'invalid_input']);
}

$required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_FROM_NAME', 'MAIL_TO'];
foreach ($required as $k) {
    if (getenv($k) === false || getenv($k) === '') {
        error_log("contacto.php: falta variable de entorno obligatoria $k");
        respond(500, ['ok' => false, 'error' => 'server_error']);
    }
}

// getenv() devuelve string siempre — comparación estricta a 'true' para evitar que "false" prenda debug.
$debug = getenv('DEBUG_SMTP') === 'true';

$mail = new PHPMailer(true);

try {
    if ($debug) {
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $debugOutput = '';
        $mail->Debugoutput = function (string $str, int $level) use (&$debugOutput): void {
            $debugOutput .= "[$level] $str\n";
        };
    }

    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST');
    $mail->Port       = (int) getenv('SMTP_PORT');
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER');
    $mail->Password   = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(getenv('MAIL_FROM'), getenv('MAIL_FROM_NAME'));
    $mail->addAddress(getenv('MAIL_TO'));
    $bcc = getenv('MAIL_BCC');
    if (!empty($bcc)) {
        $mail->addBCC($bcc);
    }
    $mail->addReplyTo($email, $name);

    $host = $_SERVER['HTTP_HOST'] ?? 'gruposaturno.com.uy';
    $langTag = $lang !== null ? '[' . strtoupper($lang) . '] ' : '';
    $mail->Subject = $langTag . "Nuevo contacto desde $host";

    $esc = fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
    $langDisplay = $lang !== null ? strtoupper($lang) : '—';

    $mail->isHTML(true);
    $mail->Body = '<p>'
                . '<strong>Nombre:</strong> '  . $esc($name)        . '<br>'
                . '<strong>Empresa:</strong> ' . $esc($company)     . '<br>'
                . '<strong>País:</strong> '    . $esc($country)     . '<br>'
                . '<strong>Email:</strong> '   . $esc($email)       . '<br>'
                . '<strong>Idioma:</strong> '  . $esc($langDisplay) . '</p>'
                . '<p><strong>Mensaje:</strong><br>' . nl2br($esc($message)) . '</p>';

    $mail->AltBody = "Nombre:   $name\n"
                   . "Empresa:  $company\n"
                   . "País:     $country\n"
                   . "Email:    $email\n"
                   . "Idioma:   $langDisplay\n\n"
                   . "Mensaje:\n$message\n";

    $mail->send();
    $response = ['ok' => true];
    if ($debug) {
        $response['debug'] = $debugOutput;
    }
    respond(200, $response);

} catch (Exception $e) {
    error_log('contacto.php SMTP error: ' . $mail->ErrorInfo);
    $response = ['ok' => false, 'error' => 'send_failed'];
    if ($debug) {
        $response['debug'] = ($debugOutput ?? '') . "\nErrorInfo: " . $mail->ErrorInfo;
    }
    respond(500, $response);
}
