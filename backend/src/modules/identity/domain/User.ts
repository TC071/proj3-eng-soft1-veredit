export type UserRole = 'lawyer' | 'common';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  cpf: string;
  oab?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly role: UserRole;
  public readonly cpf: string;
  public readonly oab?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.cpf = props.cpf;
    this.oab = props.oab;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}

