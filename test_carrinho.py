import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# URL base do site GIT
URL_BASE = "https://carloseviana.github.io/Loja_tech_QA_testes"


# 🔑 Função auxiliar para logar antes dos testes
def login(driver):
    driver.get(f"{URL_BASE}/index.html")

    # Preenche login
    driver.find_element(By.ID, "username").send_keys("standard_user")
    driver.find_element(By.ID, "password").send_keys("secret_sauce")

    # Clica no botão de login
    driver.find_element(By.ID, "login-button").click()

    # Aguarda até que a página de produtos carregue (título "Produtos")
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.TAG_NAME, "h2"))
    )

# ✅ Teste: adicionar item ao carrinho
def test_adicionar_item(driver):
    login(driver)
    driver.get(f"{URL_BASE}/products.html")

    driver.find_element(By.ID, "add-1").click()  # adiciona produto
    driver.find_element(By.ID, "go-to-cart").click()  # vai para carrinho

    item = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "cart-item"))
    )

    assert item.is_displayed()

# ✅ Teste: remover item do carrinho
def test_remover_item(driver):
    login(driver)
    driver.get(f"{URL_BASE}/products.html")

    driver.find_element(By.ID, "add-1").click()
    driver.find_element(By.ID, "go-to-cart").click()

    btn_remover = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "btn-remove"))
    )
    btn_remover.click()

    vazio = WebDriverWait(driver, 5).until(
        EC.visibility_of_element_located((By.ID, "cart-empty"))
    )

    assert "Seu carrinho está vazio" in vazio.text

# ✅ Teste: alterar quantidade do item no carrinho
def test_alterar_quantidade(driver):
    login(driver)
    driver.get(f"{URL_BASE}/products.html")

    driver.find_element(By.ID, "add-1").click()
    driver.find_element(By.ID, "go-to-cart").click()

    qty_input = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, "qty"))
    )

    qty_input.clear()
    qty_input.send_keys("2")

    total = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "cart-total-value"))
    )

    assert total.text != "R$ 0,00"

# ✅ Teste: validar cálculo do total no carrinho
def test_total_carrinho(driver):
    login(driver)
    driver.get(f"{URL_BASE}/products.html")

    driver.find_element(By.ID, "add-1").click()
    driver.find_element(By.ID, "add-2").click()
    driver.find_element(By.ID, "go-to-cart").click()

    total = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "cart-total-value"))
    )

    assert total.text != "R$ 0,00"
