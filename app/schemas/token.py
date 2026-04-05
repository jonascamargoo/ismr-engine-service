from pydantic import BaseModel

# O formato padrão de resposta do OAuth2/JWT
class Token(BaseModel):
    access_token: str
    token_type: str