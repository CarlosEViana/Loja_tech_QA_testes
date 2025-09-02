from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def test_login_sucesso():
    driver = webdriver.Chrome()
    driver.get("https://carloseviana.github.io/Loja_tech_QA_testes/")

    # Preenche os campos de login (ID = username e password)
    driver.find_element(By.ID, "username").send_keys("standard_user")
    driver.find_element(By.ID, "password").send_keys("secret_sauce")

    # Clica no botão de login (ID = login-button)
    driver.find_element(By.ID, "login-button").click()

    # Espera transição
    time.sleep(1)

    # Valida se carregou a página de produtos
    assert "Produtos" in driver.page_source
    driver.quit()

def test_login_falha():
    driver = webdriver.Chrome()
    driver.get("https://carloseviana.github.io/Loja_tech_QA_testes/")

    # Credenciais erradas
    driver.find_element(By.ID, "username").send_keys("usuario_invalido")
    driver.find_element(By.ID, "password").send_keys("senha_errada")
    driver.find_element(By.ID, "login-button").click()

    # Espera transição
    time.sleep(1)

    # A mensagem de erro é preenchida no elemento ID = error-msg
    assert "Credenciais inválidas" in driver.page_source
    driver.quit()
