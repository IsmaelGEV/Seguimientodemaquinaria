// ============================================================
// Configuración de conexión a Supabase
// ============================================================
// 1. Ve a tu proyecto en https://supabase.com -> Project Settings -> API
// 2. Copia "Project URL" y pégalo en SUPABASE_URL
// 3. Copia la clave "anon public" y pégala en SUPABASE_ANON_KEY
// 4. Guarda este archivo y súbelo junto a los demás (index.html, app.js,
//    styles.css) a tu hosting (Vercel, Netlify, etc.)
//
// IMPORTANTE: la clave "anon public" está diseñada para ser pública (viaja
// al navegador de cada usuario), así que no hay problema en incluirla aquí.
// NUNCA pongas aquí la "service_role key" (esa sí es secreta).
// ============================================================

const SUPABASE_URL = 'https://uexmuuyeypajwlcsdeyw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleG11dXlleXBhandsY3NkZXl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTYwNjEsImV4cCI6MjA5OTA5MjA2MX0.5cndpgfBcVMoREJqRR_q9xi_ZjT91a3I41d9oScEaNs';

// No edites nada debajo de esta línea.
if (SUPABASE_URL.startsWith('PEGA_AQUI') || SUPABASE_ANON_KEY.startsWith('PEGA_AQUI')) {
  console.warn(
    '[Supabase] No se ha configurado supabase-config.js todavía. ' +
    'La app funcionará solo con datos guardados en este navegador (localStorage), ' +
    'sin compartir información entre dispositivos. Completa SUPABASE_URL y ' +
    'SUPABASE_ANON_KEY en supabase-config.js para activar la base de datos real.'
  );
  window.supabaseClient = null;
} else {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
