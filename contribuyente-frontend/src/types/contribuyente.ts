export interface Contribuyente {
    rncCedula: string;
    nombre: string;
    tipo: string;
    estatus: string;
}

export interface Comprobante {
    ncf: string;
    monto: number;
    itbis18: number;
}

export interface ContribuyenteDetalle {
    rncCedula: string;
    comprobantes: Comprobante[];
    totalItbis: number;
}
