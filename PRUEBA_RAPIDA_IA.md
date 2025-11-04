# ⚡ **GUÍA DE PRUEBA RÁPIDA - IA**

## 🎯 **Objetivo**
Probar la funcionalidad de IA en 5 minutos.

---

## 📋 **REQUISITOS PREVIOS**

✅ Backend corriendo en puerto 3001  
✅ Frontend corriendo en puerto 3000  
✅ Base de datos PostgreSQL funcionando  
✅ API Key de OpenAI configurada en `api/.env` *(opcional)*

---

## 🚀 **PRUEBA 1: Análisis Automático (2 min)**

### **Paso 1: Crear cuenta de docente**
1. Abre http://localhost:3000
2. Click en "Regístrate aquí"
3. Usuario: `profesor_test`
4. Contraseña: `Test123`
5. Rol: **Docente**
6. Click "Registrarse"

### **Paso 2: Iniciar sesión como docente**
1. Login con `profesor_test` / `Test123`
2. Deberías ver el dashboard de docente

### **Paso 3: Crear convocatoria**
1. Click en "Publicar Nueva Convocatoria"
2. Completa:
   - Título: `Monitor de Programación I`
   - Materia: `Programación I`
   - Descripción: `Buscamos monitor con experiencia en Python`
   - Habilidades: `Python, Didáctica, Paciencia`
   - Requisitos: `Semestre 6+, Promedio 4.0+`
   - Fecha fin: `2025-12-31`
3. Click "Publicar"

### **Paso 4: Crear cuenta de estudiante**
1. Logout (botón cerrar sesión)
2. Click "Regístrate aquí"
3. Usuario: `estudiante_test`
4. Contraseña: `Test123`
5. Rol: **Estudiante**
6. Click "Registrarse"

### **Paso 5: Postularse (🤖 AQUÍ SE ACTIVA LA IA)**
1. Login como `estudiante_test`
2. Deberías ver la convocatoria "Monitor de Programación I"
3. Click en "Ver más"
4. Click en "Postúlate"
5. Completa el formulario detalladamente:
   ```
   Nombre completo: Juan Pérez
   ID estudiante: 12345678
   Programa: Ingeniería de Sistemas
   Semestre: 7
   Promedio: 4.3
   Email: juan.perez@udem.edu.co
   Teléfono: 3001234567
   
   Experiencia previa: Sí
   Detalles: "Fui monitor de Programación Básica durante 2 semestres.
             Tengo experiencia explicando conceptos de Python, estructuras de datos
             y algoritmos. He desarrollado proyectos con Django y Flask.
             Soy paciente y me gusta ayudar a mis compañeros a entender la lógica
             de programación. Tengo disponibilidad de 10 horas semanales."
   
   Materias de interés: Programación I, Algoritmos
   Disponibilidad: Lunes a Viernes 2-6 PM
   ```
6. (Opcional) Sube un CV en PDF
7. Click "Enviar Postulación"

### **Paso 6: Ver score de IA** ⭐
1. Deberías ver mensaje: "¡Postulación enviada exitosamente!"
2. Logout
3. Login como `profesor_test`
4. Click en "Gestión de Candidatos"
5. **Verás a "Juan Pérez" con un SCORE calculado por IA** (ej. 85%)

### **Resultado esperado:**
```
✅ Score entre 70-95% (perfil completo con experiencia)
✅ Análisis tomó 3-8 segundos
✅ Score visible en la tabla
```

---

## 🔄 **PRUEBA 2: Recalcular Score (1 min)**

### **Continuando como docente:**

1. En "Gestión de Candidatos", localiza a "Juan Pérez"
2. Click en el botón **🤖** (robot)
3. Confirma: "¿Deseas recalcular el score...?"
4. Click OK
5. Espera 3-8 segundos
6. Verás alert: `✅ Score actualizado: X% → Y%`

### **Resultado esperado:**
```
✅ Score recalculado (puede variar ligeramente)
✅ Tabla actualizada con nuevo score
✅ Proceso completado sin errores
```

---

## 🔍 **PRUEBA 3: Filtro IA (1 min)**

### **Continuando en "Gestión de Candidatos":**

1. Click en botón "Filtro IA 🔍"
2. Ajusta el slider a **80%**
3. Click "Aplicar"
4. **Solo verás candidatos con score ≥80%**

### **Resultado esperado:**
```
✅ Tabla filtrada correctamente
✅ Barra de estadísticas muestra:
   - Total candidatos
   - Candidatos mostrados (filtrados)
   - Promedio IA de los mostrados
```

---

## 🧪 **PRUEBA 4: Candidato con Bajo Score (1 min)**

### **Crear otro estudiante con perfil básico:**

1. Logout y registra nuevo estudiante:
   - Usuario: `estudiante2_test`
   - Contraseña: `Test123`

2. Postularse con perfil mínimo:
   ```
   Nombre: María López
   Semestre: 3
   Promedio: 3.5
   
   Detalles: "Estoy interesada en aprender."
   ```
   
3. NO subir CV
4. Enviar postulación

5. Login como docente
6. Ver "Gestión de Candidatos"
7. **María López debería tener score bajo (30-50%)**

### **Resultado esperado:**
```
✅ Score bajo (30-50%) por:
   - Semestre bajo (3 < 6)
   - Promedio bajo (3.5 < 4.0)
   - Perfil poco detallado
   - Sin CV
```

---

## 📊 **VERIFICAR EN LOGS DEL BACKEND**

### **Terminal donde corre `npm run dev`:**

Deberías ver:
```bash
🤖 Analizando CV con IA...
✅ IA analizó CV: Score = 85%

🤖 Recalculando score con IA para aplicación 1...
✅ Score actualizado: 85% → 87%
```

Si **NO** ves estos logs:
- ⚠️ La IA no está configurada
- ✅ El sistema está usando método básico (fallback)

---

## ❌ **SI ALGO SALE MAL**

### **Error: "Invalid API Key"**
```bash
# Solución:
1. Verifica api/.env
2. Asegúrate que OPENAI_API_KEY esté correcta
3. Reinicia el servidor backend
```

### **Score siempre 0%**
```bash
# Posibles causas:
1. API Key no configurada → Usar método básico
2. Perfil muy corto → Escribir más detalles
3. Habilidades no coinciden → Mencionar palabras clave
```

### **Error 500 al postularse**
```bash
# Solución:
1. Verifica que el backend esté corriendo
2. Revisa logs del backend para ver error
3. Verifica que la carpeta api/uploads/ exista
```

### **Botón 🤖 no hace nada**
```bash
# Solución:
1. Abre consola del navegador (F12)
2. Ve a Network tab
3. Verifica si hay errores 401/403
4. Asegúrate de estar logueado como docente
```

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] Score de IA aparece al postularse
- [ ] Score está entre 0-100%
- [ ] Botón 🤖 recalcula correctamente
- [ ] Filtro IA funciona
- [ ] Logs del backend muestran "🤖 Analizando CV..."
- [ ] Tabla de candidatos se actualiza
- [ ] Estadísticas (Total, Promedio) correctas

---

## 🎉 **¡PRUEBA COMPLETADA!**

Si todas las pruebas pasaron:
- ✅ **IA está funcionando correctamente**
- ✅ **Sistema completo operativo**
- ✅ **Listo para usar en producción**

---

## 📸 **EVIDENCIAS VISUALES**

### **Lo que deberías ver:**

**Gestión de Candidatos:**
```
┌────────────────────────────────────────────┐
│ 🔍 Buscar...    [Filtro IA]   [Limpiar]   │
├────────────────────────────────────────────┤
│ Total: 2 | Mostrados: 2 | Promedio: 67%   │
├────────────────────────────────────────────┤
│ Juan Pérez  │ Prog I │ Post. │ 85% │👁🤖✔🗑│
│ María López │ Prog I │ Post. │ 42% │👁🤖✔🗑│
└────────────────────────────────────────────┘
```

**Filtro IA aplicado (≥80%):**
```
┌────────────────────────────────────────────┐
│ Total: 2 | Mostrados: 1 | Promedio: 85%   │
├────────────────────────────────────────────┤
│ Juan Pérez  │ Prog I │ Post. │ 85% │👁🤖✔🗑│
└────────────────────────────────────────────┘
```

---

## ⏱️ **TIEMPO ESTIMADO**

- Prueba 1 (Análisis automático): **2 minutos**
- Prueba 2 (Recalcular): **1 minuto**
- Prueba 3 (Filtro): **1 minuto**
- Prueba 4 (Bajo score): **1 minuto**

**TOTAL: ~5 minutos** ⚡

---

¡Listo! Si todo funciona, tu IA está **100% operativa**. 🚀
