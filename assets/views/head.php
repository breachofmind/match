<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Happy Holidays from Brightstar</title>

    <meta name="description" content="Happy Holidays! Enjoy a fun game.">
    <meta name="viewport" content="width=device-width">

    <link rel="stylesheet" href="/public/site.css">
    <script src="/public/site.lib.js"></script>
    <script src="/public/site.src.js"></script>

    <?php if (env('APP_ENV') != "production") : ?>
        <!-- For active development, browser reloading -->
        <script src="http://localhost:35729/livereload.js"></script>
    <?php endif; ?>
</head>


<body ng-app="memorygame">

<!--[if lte IE 8]>
<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
<![endif]-->