# 🤖 **CONFIGURACIÓN DE IA PARA ANÁLISIS DE CV**

## **¿Qué hace la IA?**

El sistema usa **GPT-4o-mini** de OpenAI para analizar hojas de vida de estudiantes y calcular un **score de compatibilidad** (0-100%) basado en:

- ✅ Experiencia académica (promedio, semestre, materias)
- ✅ Habilidades técnicas (lenguajes, herramientas, frameworks)
- ✅ Experiencia previa (monitorias, proyectos)
- ✅ Competencias blandas (liderazgo, comunicación)
- ✅ Disponibilidad y compromiso

---

## **📋 PASO 1: Obtener tu API Key de OpenAI**

1. **Crea una cuenta** en [OpenAI Platform](https://platform.openai.com/)
2. **Agrega un método de pago** (tarjeta de crédito/débito)
3. **Genera una API Key:**
   - Ve a: https://platform.openai.com/api-keys
   - Click en "**Create new secret key**"
   - Copia la key (empieza con `sk-proj-...`)

⚠️ **Importante:** Guarda la key en un lugar seguro, no la compartas públicamente.

---

## **⚙️ PASO 2: Configurar tu proyecto**

### **Opción A: Editar el archivo `.env` directamente**

1. Abre el archivo `api/.env`
2. Busca esta línea:
   ```
   OPENAI_API_KEY=tu_api_key_aqui
   ```
3. Reemplaza `tu_api_key_aqui` con tu API key real:
   ```
   OPENAI_API_KEY=sk-proj-ABC123XYZ...
   ```
4. **Guarda el archivo**

### **Opción B: Configurar desde VS Code**

```powershell
# Navega a la carpeta api
cd api

# Abre el archivo .env con Notepad
notepad .env

# Pega tu API key después de OPENAI_API_KEY=
# Guarda y cierra Notepad
```

---

## **🚀 PASO 3: Reiniciar el servidor backend**

Para que los cambios surtan efecto:

1. **Detén el servidor actual** (Ctrl + C en la terminal donde corre `npm run dev`)
2. **Reinicia el servidor:**
   ```powershell
   cd api
   npm run dev
   ```

---

## **✨ CÓMO USAR LA IA**

### **Análisis automático al postularse**

Cuando un estudiante se postula a una convocatoria:
- ✅ El sistema **automáticamente** analiza su perfil y CV con IA
- ✅ Calcula el score de compatibilidad
- ✅ Lo almacena en la base de datos

### **Recalcular score manualmente (Docentes)**

Si quieres re-analizar un candidato:

1. Ve a **"Gestión de Candidatos"**
2. En la tabla, click en el botón **🤖** (robot)
3. Confirma la acción
4. Espera unos segundos (la IA está procesando...)
5. ¡Listo! Verás el nuevo score actualizado

### **Filtrar por score de IA**

En **"Gestión de Candidatos"**:
- Click en **"Filtro IA 🔍"**
- Ajusta el slider (ej. 70% = mostrar solo candidatos con +70%)
- Aplica el filtro
- ¡Ves solo los mejores candidatos!

---

## **💰 COSTOS ESTIMADOS**

**GPT-4o-mini** es muy económico:
- **~$0.0015 USD** por cada 1000 tokens de entrada
- **~$0.006 USD** por cada 1000 tokens de salida

**Traducción:**
- **1 análisis de CV** ≈ $0.001 - $0.003 USD (menos de 1 centavo)
- **100 análisis** ≈ $0.10 - $0.30 USD
- **1000 análisis** ≈ $1 - $3 USD

💡 **Tip:** OpenAI da **$5 USD de crédito gratis** a nuevos usuarios.

---

## **🛠️ MODO FALLBACK (Sin IA)**

Si **NO** configuras la API key, el sistema seguirá funcionando:
- ❌ NO usará IA para analizar CVs
- ✅ Usará un **método básico** de conteo de palabras clave
- ✅ Todas las demás funcionalidades seguirán operando

---

## **🧪 PROBAR LA IA**

### **Test rápido:**

1. Como **Estudiante:** Postúlate a una convocatoria
2. Completa tu perfil con detalles
3. Sube un CV (opcional)
4. Envía la postulación
5. Como **Docente:** Ve a "Gestión de Candidatos"
6. Verás el **score calculado por IA** (0-100%)

### **Logs del servidor:**

Revisa la terminal del backend para ver:
```
🤖 Analizando CV con IA...
✅ IA analizó CV: Score = 85%
```

---

## **❓ SOLUCIÓN DE PROBLEMAS**

### **Error: "Invalid API Key"**

- ✅ Verifica que copiaste la key completa (empieza con `sk-proj-`)
- ✅ Verifica que NO hay espacios extra al inicio/final
- ✅ Reinicia el servidor después de editar `.env`

### **Error: "Rate limit exceeded"**

- ⏳ Espera 1 minuto antes de intentar de nuevo
- 💰 Revisa tu límite de uso en [OpenAI Platform](https://platform.openai.com/usage)

### **Error: "Insufficient quota"**

- 💳 Agrega créditos a tu cuenta de OpenAI
- 📊 Verifica tu plan en [Billing](https://platform.openai.com/settings/organization/billing/overview)

### **El score sigue siendo 0% o muy bajo**

- 📝 Verifica que el perfil del estudiante tenga información detallada
- 📄 Verifica que el CV sea un PDF válido
- 🔍 Revisa los logs del backend para ver qué está pasando

---

## **🔒 SEGURIDAD**

⚠️ **NUNCA subas el archivo `.env` a GitHub o repositorios públicos**

El archivo `.gitignore` ya incluye `.env` para protegerlo, pero verifica siempre:

```bash
# En .gitignore debe estar:
.env
```

---

## **📚 REFERENCIAS**

- **OpenAI API Docs:** https://platform.openai.com/docs
- **GPT-4o-mini:** https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/
- **Pricing:** https://openai.com/api/pricing/

---

## **✅ CHECKLIST DE CONFIGURACIÓN**

- [ ] Cuenta de OpenAI creada
- [ ] API Key obtenida
- [ ] `.env` configurado con la key
- [ ] Servidor backend reiniciado
- [ ] Test de postulación realizado
- [ ] Score de IA visible en Gestión de Candidatos

---

¡Listo! 🎉 Tu sistema ahora tiene **inteligencia artificial** para evaluar candidatos de forma automática.
