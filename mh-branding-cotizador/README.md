# MH Branding Cotizador

Aplicación para consultar precios por código de producto y mantener una lista maestra de precios de MH Branding.

## Funciones
- Buscar por código de producto.
- Ver descripción, técnica, rango de cantidad y precio.
- Cargar una lista CSV actualizada.
- Descargar la base de precios.
- Preparada para crecer conforme se agreguen productos al catálogo.

## Ejecutar localmente
```bash
pip install -r requirements.txt
streamlit run app.py
```

## Estructura de datos
El archivo `seed_prices.csv` usa estas columnas:
- `code`
- `product`
- `technique`
- `qty_range`
- `price`
- `notes`

## Próximo paso
Publicar esta carpeta como app web en Streamlit Community Cloud para poder abrirla desde cualquier dispositivo con un enlace.
