import app from './app';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Backend démarré → http://localhost:${PORT}`);
  console.log(` Swagger UI → http://localhost:${PORT}/api-docs`);
});
