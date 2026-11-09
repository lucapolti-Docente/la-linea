/* Todos los generadores de tableros, por nombre (el campo gen de cada nivel). */
import { GEN as MUEBLES } from './muebles.js';
import { GEN as RECI } from './reci.js';
import { GEN as USINA } from './usina.js';

export const GEN = { ...MUEBLES, ...RECI, ...USINA };
