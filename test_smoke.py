from selenium import webdriver

def test_homepage():
    driver = webdriver.Chrome()

    # Abre a página inicial (login)
    driver.get("https://carloseviana.github.io/Loja_tech_QA_testes/")

    # Verifica se a frase do login aparece
    assert "Acesse sua conta" in driver.page_source

    driver.quit()
