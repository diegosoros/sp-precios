import streamlit as st
import pandas as pd
from pathlib import Path

DATA_FILE = Path(__file__).with_name("seed_prices.csv")

st.set_page_config(page_title="MH Branding Cotizador", page_icon="👑", layout="wide")

st.markdown(
    """
    <style>
    .stApp { background:#E9DFCF; }
    .block-container { max-width:1200px; padding-top:1.5rem; }
    h1,h2,h3 { color:#171717; }
    .mh-card { background:#F5EFE5; border:1px solid #CDBDAA; border-radius:16px; padding:18px; }
    .stButton>button { background:#A94E21; color:#fff; border:none; border-radius:10px; font-weight:700; }
    </style>
    """,
    unsafe_allow_html=True,
)

@st.cache_data
def load_default():
    return pd.read_csv(DATA_FILE)

if "prices" not in st.session_state:
    st.session_state.prices = load_default().copy()

st.title("MH Branding · Cotizador")
st.caption("Busca por código y consulta todas las opciones de precio disponibles.")

search_tab, upload_tab, all_tab = st.tabs(["🔎 Buscar", "📄 Actualizar lista", "🗂️ Ver todos"])

with search_tab:
    code = st.text_input("Código del producto", placeholder="Ej. CRC106-100A")

    if code:
        df = st.session_state.prices
        match = df[df["code"].astype(str).str.contains(code.strip(), case=False, na=False)]

        if match.empty:
            st.warning("No encontré ese código.")
        else:
            for product_code in match["code"].drop_duplicates():
                block = match[match["code"] == product_code]
                st.subheader(f"{block.iloc[0]['product']} · {product_code}")

                for technique in block["technique"].drop_duplicates():
                    st.markdown(f"### {technique}")
                    table = block[block["technique"] == technique][["qty_range", "price", "notes"]].copy()
                    table["price"] = table["price"].map(lambda x: f"${float(x):,.0f} c/u")
                    table.columns = ["Cantidad", "Precio", "Notas"]
                    st.dataframe(table, use_container_width=True, hide_index=True)

with upload_tab:
    st.markdown("### Cargar lista actualizada")
    st.write("Para que la app pueda leerla sin errores, usa un CSV con las columnas: code, product, technique, qty_range, price, notes.")

    upload = st.file_uploader("Selecciona CSV", type=["csv"])
    if upload is not None:
        try:
            new_df = pd.read_csv(upload)
            required = {"code", "product", "technique", "qty_range", "price", "notes"}
            missing = required - set(new_df.columns)
            if missing:
                st.error("Faltan columnas: " + ", ".join(sorted(missing)))
            else:
                st.dataframe(new_df.head(20), use_container_width=True, hide_index=True)
                if st.button("Usar esta lista"):
                    st.session_state.prices = new_df.copy()
                    st.success("Lista actualizada para esta sesión.")
        except Exception as e:
            st.error(f"No pude leer el archivo: {e}")

    st.download_button(
        "Descargar plantilla / lista actual",
        data=st.session_state.prices.to_csv(index=False).encode("utf-8-sig"),
        file_name="mh_branding_precios.csv",
        mime="text/csv",
    )

with all_tab:
    st.metric("Registros de precio", len(st.session_state.prices))
    st.dataframe(st.session_state.prices, use_container_width=True, hide_index=True)
