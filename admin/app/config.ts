export const error: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Credenciais inválidas',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Já existe uma conta com este e-mail. Use outro e-mail.'
}

export const wait = async (secs: number) => {
  await new Promise((r) => setTimeout(r, secs * 1000))
}