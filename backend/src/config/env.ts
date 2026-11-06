import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_veridit_2026_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  evidenceStoragePath: process.env.EVIDENCE_STORAGE_PATH || './evidence_storage',
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'veridit',
    user: process.env.POSTGRES_USER || 'veridit_user',
    password: process.env.POSTGRES_PASSWORD || 'veridit_secret',
  }
};

