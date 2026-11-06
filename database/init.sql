-- ========================================================
-- Inicialização do Banco de Dados PostgreSQL — Veridit
-- Conforme ADR 4: Instância única com isolamento por schemas
-- ========================================================

-- Schema para o Serviço de Identidade (C02, C03)
CREATE SCHEMA IF NOT EXISTS identidade;

-- Schema para o Serviço de Registros de Evidências (C10, C12, C13)
CREATE SCHEMA IF NOT EXISTS registros;

-- Schema para Créditos e Pagamentos (Futuro / Reserva de escopo)
CREATE SCHEMA IF NOT EXISTS creditos;

-- --------------------------------------------------------
-- Tabelas do Schema Identidade
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS identidade.users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'common', -- 'lawyer' ou 'common'
    cpf VARCHAR(14) UNIQUE NOT NULL,
    oab VARCHAR(50), -- Opcional para usuário comum, obrigatório para advogado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- Tabelas do Schema Registros
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS registros.evidence_records (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, CAPTURING, COMPLETED, FAILED
    capture_type VARCHAR(50) NOT NULL DEFAULT 'SCREENSHOT', -- SCREENSHOT, VIDEO
    file_path TEXT,
    sha256_hash VARCHAR(64),
    server_ip VARCHAR(45),
    captured_at TIMESTAMP WITH TIME ZONE,
    http_headers JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_records_user_id ON registros.evidence_records(user_id);

