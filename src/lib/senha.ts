import "server-only";
import bcrypt from "bcryptjs";

export function hashSenha(senha: string) {
  return bcrypt.hash(senha, 10);
}

export function verificarSenha(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}
