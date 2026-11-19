/**
 * Lançado quando o registro não existe ou não pertence ao usuário autenticado.
 * Os dois casos usam o mesmo erro para não revelar a existência de registros de terceiros.
 */
export class RecordNotFoundError extends Error {
  constructor() {
    super('Registro não encontrado.');
    this.name = 'RecordNotFoundError';
  }
}
