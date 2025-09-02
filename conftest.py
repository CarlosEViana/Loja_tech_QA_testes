import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

@pytest.fixture
def driver():
    # Inicia o navegador Chrome (com webdriver_manager, sem precisar baixar manualmente)
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")  # abre em tela cheia
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    yield driver  # Entrega o driver para o teste

    driver.quit()  # Fecha o navegador após o teste
