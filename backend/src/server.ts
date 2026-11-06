import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`===============================================`);
  console.log(`🚀 Veridit Backend iniciado com sucesso!`);
  console.log(`📡 Ouvindo na porta: ${env.port}`);
  console.log(`🛡️  Módulos carregados: Identidade (C02/C03) & Registros (C10/C11/C12)`);
  console.log(`===============================================`);
});

