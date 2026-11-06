export type RecordStatus = 'PENDING' | 'CAPTURING' | 'COMPLETED' | 'FAILED';
export type CaptureType = 'SCREENSHOT' | 'VIDEO';

export interface EvidenceRecordProps {
  id: string;
  userId: string;
  targetUrl: string;
  status: RecordStatus;
  captureType: CaptureType;
  filePath?: string;
  sha256Hash?: string;
  serverIp?: string;
  capturedAt?: Date;
  httpHeaders?: Record<string, string>;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EvidenceRecord {
  public readonly id: string;
  public readonly userId: string;
  public readonly targetUrl: string;
  public status: RecordStatus;
  public readonly captureType: CaptureType;
  public filePath?: string;
  public sha256Hash?: string;
  public serverIp?: string;
  public capturedAt?: Date;
  public httpHeaders?: Record<string, string>;
  public metadata?: Record<string, any>;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: EvidenceRecordProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.targetUrl = props.targetUrl;
    this.status = props.status;
    this.captureType = props.captureType;
    this.filePath = props.filePath;
    this.sha256Hash = props.sha256Hash;
    this.serverIp = props.serverIp;
    this.capturedAt = props.capturedAt;
    this.httpHeaders = props.httpHeaders;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  public markAsCompleted(
    filePath: string,
    sha256Hash: string,
    serverIp: string,
    capturedAt: Date,
    httpHeaders?: Record<string, string>
  ): void {
    this.status = 'COMPLETED';
    this.filePath = filePath;
    this.sha256Hash = sha256Hash;
    this.serverIp = serverIp;
    this.capturedAt = capturedAt;
    this.httpHeaders = httpHeaders;
    this.updatedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = 'FAILED';
    this.updatedAt = new Date();
  }
}

