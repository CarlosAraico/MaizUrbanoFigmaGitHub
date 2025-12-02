import datetime
import json
import os
from typing import List

import pandas as pd
import requests

COLUMNS = [
    "PRODUCTO",
    "UNIDAD",
    "FECHA",
    "PEDIDOS",
    "COMPRAS",
    "PRES",
    "SUCURSAL",
    "MERMAS",
    "BODEGA",
    "PISO",
    "FINAL",
    "CONSUMO",
]

NUMERIC_COLUMNS = [
    "PEDIDOS",
    "COMPRAS",
    "PRES",
    "SUCURSAL",
    "MERMAS",
    "BODEGA",
    "PISO",
    "FINAL",
    "CONSUMO",
]

ORDER_COLUMNS = ["SUCURSAL", "PRODUCTO", "FECHA", "DIA"]


def log(msg: str) -> None:
    ahora = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ahora}] {msg}")


def get_day_sheets(xls: pd.ExcelFile) -> List[str]:
    day_sheets = sorted([s for s in xls.sheet_names if str(s).isdigit()], key=int)
    if not day_sheets:
        raise ValueError("No se encontraron hojas numéricas en el Excel.")
    return day_sheets


def normalize_sheet(df: pd.DataFrame, sheet_name: str) -> pd.DataFrame:
    df = df.loc[:, ~df.columns.astype(str).str.contains("Unnamed")]
    df = df.iloc[:, : len(COLUMNS)]
    df.columns = COLUMNS[: len(df.columns)]

    df = df[df["PRODUCTO"].notna()]
    df = df[~df["PRODUCTO"].astype(str).str.contains("PRODUCTOS", na=False)]

    for col in NUMERIC_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["DIA"] = int(sheet_name)
    return df.reset_index(drop=True)


def clean_inventory_excel(path: str) -> pd.DataFrame:
    if not os.path.exists(path):
        raise FileNotFoundError(f"No se encontró '{path}'")

    log("Leyendo archivo Excel...")
    xls = pd.ExcelFile(path)
    day_sheets = get_day_sheets(xls)

    registros = []
    for sheet in day_sheets:
        log(f"Procesando hoja {sheet}...")
        df = pd.read_excel(xls, sheet_name=sheet)
        registros.append(normalize_sheet(df, sheet))

    log("Unificando días...")
    df_final = pd.concat(registros, ignore_index=True)

    if df_final.empty:
        raise ValueError("El DataFrame final está vacío.")

    sort_cols = [c for c in ORDER_COLUMNS if c in df_final.columns]
    if sort_cols:
        df_final = df_final.sort_values(sort_cols)

    log("Calculando INICIAL por producto...")
    if "FINAL" in df_final.columns:
        if "SUCURSAL" in df_final.columns:
            df_final["INICIAL"] = df_final.groupby(["SUCURSAL", "PRODUCTO"])["FINAL"].shift(1)
        else:
            df_final["INICIAL"] = df_final.groupby("PRODUCTO")["FINAL"].shift(1)
    else:
        df_final["INICIAL"] = pd.NA

    df_final = df_final.reset_index(drop=True)
    log(f"Filas procesadas: {len(df_final)}")
    return df_final


def send_to_webhook(df: pd.DataFrame, webhook_url: str) -> None:
    payload = {"headers": list(df.columns), "rows": df.values.tolist()}
    log("Enviando datos al webhook...")
    response = requests.post(webhook_url, json=payload, timeout=30)
    response.raise_for_status()
    log(f"Respuesta del servidor: {response.text}")


if __name__ == "__main__":
    log("Iniciando proceso...")
    dataframe = clean_inventory_excel("inventarios.xlsx")

    webhook_url = os.getenv("WEBHOOK_URL")
    if not webhook_url:
        raise RuntimeError("Falta la variable de entorno WEBHOOK_URL")

    send_to_webhook(dataframe, webhook_url)
    log("Proceso completado.")
