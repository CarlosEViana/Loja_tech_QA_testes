# Projeto 1 – Automação de Testes Web (Selenium + Pytest) 🚀

Automação de cenários no **SauceDemo** usando **Python + Selenium + Pytest**.  
Aqui eu pratico o fluxo de login, adição de itens ao carrinho e validações básicas de um e-commerce.

---


## 📂 Estrutura

Projeto 1 (Automação)/
│
├─ confest.py
├─ requirements.txt
├─ README.md
└─ tests/
├─ test_login.py
├─ test_carrinho.py
├─ test_smoke.py



---

## ⚡ Como Executar

1. **Criar (e ativar) o ambiente virtual**

```bash
python -m venv venv
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate


##2. Instalar dependências
pip install -r requirements.txt

## ⚡ RODEEE OS TESTES!!
pytest -q --tb=short --disable-warnings


Você deve ver algo como:

7 passed



## ✅ Progresso
- [x] Ambiente configurado (venv, Selenium, Pytest)
- [x] Smoke test carregando homepage
- [x] Login com sucesso
- [x] Login com falha (credenciais inválidas)
- [x] Validações de carrinho



## O que é validado nos testes?

1.Login de usuário válido
2.Login inválido com mensagem de erro
3.Adição de produtos ao carrinho
4.Total correto do carrinho
5.Fluxo completo de checkout
6.Mensagens de confirmação do pedido