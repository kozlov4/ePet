from jinja2 import Template
from weasyprint import HTML, CSS
import base64
import os
import requests

# ==============================================================================
# 1. ВИТЯГ (Ідентифікація)
# ==============================================================================
EXTRACT_TEMPLATE = """
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 20mm; }
        body { line-height: 2.0; margin: 0; padding: 0; color: #000; }
        p, div { margin-top: 0; margin-bottom: 0; }
        
        .header-title { font-family: 'Oswald', sans-serif; font-size: 36pt; line-height: 1; margin-top: 10pt; margin-bottom: 0pt; color: #333; }
        .divider { border-bottom: 3px solid #333; margin-top: 25pt; margin-bottom: 10pt; width: 100%; }
        
        .roboto-9 { font-family: 'Roboto Condensed', sans-serif; font-size: 9pt; }
        .passport-id { font-family: 'Roboto Condensed', sans-serif; font-size: 20pt; font-weight: 700; line-height: 1.2; }
        
        .mont-11-bold { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 700; }
        .mont-11 { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 400; }
        .mont-9 { font-family: 'Montserrat', sans-serif; font-size: 9pt; font-weight: 400; }
        
        .spacer-roboto-9 { height: 9pt; }
        .spacer-mont-11 { height: 11pt; }
        
        .signature-block { margin-top: 50pt; text-align: right; font-family: 'Montserrat', sans-serif; font-size: 9pt; }
        .signature-img { width: 250px; display: block; margin-left: auto; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header-title">Офіційний витяг про <br>ідентифікаційні дані тварини</div>
    <div class="divider"></div>
    <div class="roboto-9">Дата створення: {{ creation_date }}</div>
    <div class="spacer-roboto-9"></div>
    <div class="passport-id">{{ passport_id }}</div>
    <div class="mont-11"><span class="mont-11-bold">Імʼя:</span> <span class="mont-11-bold">{{ pet_name }}</span></div>
    <div class="mont-11">Вид: {{ species }}</div>
    <div class="mont-11">Порода: {{ breed }}</div>
    <div class="spacer-mont-11"></div>
    <div class="spacer-mont-11"></div>
    <div class="mont-11">{{ identifier_db_id }}</div>
    <div class="mont-11">Номер ідентифікатора: {{ identifier_number }}</div>
    <div class="mont-11">Тип ідентифікації: {{ identifier_type }}</div>
    <div class="mont-11">Дата ідентифікації: {{ identifier_date }}</div>
    <div class="spacer-mont-11"></div>
    <div class="spacer-mont-11"></div>
    <div class="mont-9">Організація в якій було зареєстровано ідентифікацію:</div>
    <div class="mont-9">Назва: {{ cnap.name }}</div>
    <div class="mont-9">Адреса: {{ cnap.city }}, {{ cnap.street }}</div>
    <div class="mont-9">Тел: {{ cnap.phone_number }}</div>
    <div class="signature-block">
        {% if signature_b64 %}<img src="data:image/png;base64,{{ signature_b64 }}" class="signature-img">{% else %}<div style="height: 60px;"></div>{% endif %}
        <div style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">Затверджено гендиректором «єУлюбленець»</div>
    </div>
</body>
</html>
"""

# ==============================================================================
# 2. ЩЕПЛЕННЯ (Вакцинація)
# ==============================================================================
VACCINATION_TEMPLATE = """
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 20mm; }
        body { line-height: 2.0; margin: 0; padding: 0; color: #000; }
        p, div { margin-top: 0; margin-bottom: 0; }

        .header-title { font-family: 'Oswald', sans-serif; font-size: 36pt; line-height: 1; margin-top: 10pt; margin-bottom: 0pt; color: #333; }
        .divider { border-bottom: 3px solid #333; margin-top: 25pt; margin-bottom: 10pt; width: 100%; }
        .roboto-9 { font-family: 'Roboto Condensed', sans-serif; font-size: 9pt; }
        .passport-id { font-family: 'Roboto Condensed', sans-serif; font-size: 20pt; font-weight: 700; line-height: 1.2; }
        .mont-11-bold { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 700; }
        .mont-11 { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 400; }
        .spacer-roboto-9 { height: 9pt; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 20pt; font-family: 'Montserrat', sans-serif; font-size: 10pt; line-height: 1.3; }
        th { background-color: #f3f3f3; border: 1px solid #ccc; padding: 8pt; text-align: left; font-weight: 700; }
        td { border: 1px solid #ccc; padding: 8pt; vertical-align: top; }

        .signature-block { margin-top: 50pt; text-align: right; font-family: 'Montserrat', sans-serif; font-size: 9pt; }
        .signature-img { width: 250px; display: block; margin-left: auto; margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header-title">Медичний витяг про <br>проведені щеплення тварини</div>
    <div class="divider"></div>
    <div class="roboto-9">Дата створення: {{ creation_date }}</div>
    <div class="spacer-roboto-9"></div>
    <div class="passport-id">{{ passport_id }}</div>
    <div class="mont-11"><span class="mont-11-bold">Імʼя:</span> <span class="mont-11-bold">{{ pet_name }}</span></div>
    <div class="mont-11">Вид: {{ species }}</div>
    <div class="mont-11">Порода: {{ breed }}</div>

    <table>
        <thead>
            <tr>
                <th style="width: 45%;">Виробник, назва та серія:</th>
                <th style="width: 25%;">Дата:</th>
                <th style="width: 30%;">Лікар:</th>
            </tr>
        </thead>
        <tbody>
            {% for vac in vaccinations %}
            <tr>
                <td>{{ vac.manufacturer }}, {{ vac.drug_name }},<br>{{ vac.series_number }}</td>
                <td>{{ vac.vaccination_date }}<br>до {{ vac.valid_until }}</td>
                <td>{{ vac.organization_name }}</td>
            </tr>
            {% endfor %}
        </tbody>
    </table>

    <div class="signature-block">
        {% if signature_b64 %}<img src="data:image/png;base64,{{ signature_b64 }}" class="signature-img">{% else %}<div style="height: 60px;"></div>{% endif %}
        <div style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">Затверджено гендиректором «єУлюбленець»</div>
    </div>
</body>
</html>
"""

# ==============================================================================
# 3. ВИТЯГ З РЕЄСТРУ (Загальний з фото з ХМАРИ)
# ==============================================================================
GENERAL_TEMPLATE = """
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
    <style>
        @page { size: A4; margin: 20mm; }
        
        body { 
            line-height: 2.0; 
            margin: 0; padding: 0; color: #000; 
        }

        p, div { margin-top: 0; margin-bottom: 0; }

        .header-title {
            font-family: 'Oswald', sans-serif;
            font-size: 36pt;
            line-height: 1;
            margin-top: 10pt;
            margin-bottom: 0pt;
            color: #333;
        }
        .divider {
            border-bottom: 3px solid #333;
            margin-top: 25pt;
            margin-bottom: 10pt;
            width: 100%;
        }
        .roboto-9 { font-family: 'Roboto Condensed', sans-serif; font-size: 9pt; }
        .passport-id { font-family: 'Roboto Condensed', sans-serif; font-size: 20pt; font-weight: 700; line-height: 1.2; margin-bottom: 20pt; }
        
        .mont-11-bold { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 700; }
        .mont-11 { font-family: 'Montserrat', sans-serif; font-size: 11pt; font-weight: 400; }
        
        .section-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 12pt;
            font-weight: 700;
            margin-top: 20pt;
            margin-bottom: 5pt;
        }

        /* Верстка для фото тварини */
        .pet-container {
            display: flex;
            flex-direction: row;
            margin-bottom: 20pt;
        }
        .pet-photo {
            float: left;
            width: 180px;
            height: 240px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 20pt;
            background-color: #eee;
        }
        .pet-details {
            padding-top: 5pt;
        }

        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }

        .signature-block { margin-top: 50pt; text-align: right; font-family: 'Montserrat', sans-serif; font-size: 9pt; }
        .signature-img { width: 250px; display: block; margin-left: auto; margin-bottom: 5px; }
    </style>
</head>
<body>

    <div class="header-title">Витяг з реєстру<br>домашніх тварин</div>
    <div class="divider"></div>
    <div class="roboto-9">Дата створення: {{ creation_date }}</div>
    
    <div class="passport-id">{{ passport_id }}</div>

    <!-- Блок з фото -->
    <div class="clearfix">
        {% if pet_photo_b64 %}
            <!-- Вставляємо фото, завантажене з хмари -->
            <img src="data:image/jpeg;base64,{{ pet_photo_b64 }}" class="pet-photo">
        {% else %}
            <!-- Заглушка, якщо фото немає -->
            <div class="pet-photo" style="background: #ccc; display: flex; align-items: center; justify-content: center; color: #fff;">Фото відсутнє</div>
        {% endif %}

        <div class="pet-details">
            <div class="mont-11"><span class="mont-11-bold">Імʼя:</span> <span class="mont-11-bold">{{ pet_name }}</span></div>
            <div class="mont-11">Дата народження: {{ date_of_birth }}</div>
            <div style="height: 10pt;"></div>
            <div class="mont-11">Порода: {{ breed }}</div>
            <div class="mont-11">Стать: {{ gender }}</div>
            <div class="mont-11">Масть: {{ color }}</div>
            <div class="mont-11">Вид: {{ species }}</div>
            <div style="height: 10pt;"></div>
            <div class="mont-11">{{ sterilisation }}</div>
        </div>
    </div>

    <!-- Власник -->
    <div class="section-title">Інформація про власника тварини</div>
    <div class="mont-11">ФІО: {{ owner_name }}</div>
    <div class="mont-11">Адреса проживання: {{ owner_address }}</div>

    <!-- Організація -->
    <div class="section-title">Організація, що зареєструвала:</div>
    <div class="mont-11">Організація: {{ org_name }}</div>
    <div class="mont-11">Адреса реєстрації: {{ org_address }}</div>

    <!-- Підпис -->
    <div class="signature-block">
        {% if signature_b64 %}
            <img src="data:image/png;base64,{{ signature_b64 }}" class="signature-img">
        {% else %}
            <div style="height: 60px;"></div>
        {% endif %}
        <div style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">
            Затверджено гендиректором «єУлюбленець»
        </div>
    </div>

</body>
</html>
"""

def get_image_base64(path: str) -> str | None:
    if not os.path.exists(path): return None
    try:
        with open(path, "rb") as image_file: return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception: return None

def get_pet_photo_base64(img_url: str | None) -> str | None:
    if not img_url:
        return None
    
    try:
        response = requests.get(img_url, timeout=5)
        
        if response.status_code == 200:
            return base64.b64encode(response.content).decode('utf-8')
        else:
            print(f"Error downloading image: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception downloading image: {e}")
        return None


def create_identification_pdf(data: dict) -> bytes:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(os.path.dirname(current_dir), "assets")
    data["signature_b64"] = get_image_base64(os.path.join(assets_dir, "signature.png"))
    return HTML(string=Template(EXTRACT_TEMPLATE).render(**data)).write_pdf()

def create_vaccination_pdf(data: dict) -> bytes:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(os.path.dirname(current_dir), "assets")
    data["signature_b64"] = get_image_base64(os.path.join(assets_dir, "signature.png"))
    return HTML(string=Template(VACCINATION_TEMPLATE).render(**data)).write_pdf()

def create_general_pdf(data: dict, pet_img_url: str | None) -> bytes:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(os.path.dirname(current_dir), "assets")
    
    data["signature_b64"] = get_image_base64(os.path.join(assets_dir, "signature.png"))
    
    data["pet_photo_b64"] = get_pet_photo_base64(pet_img_url)

    return HTML(string=Template(GENERAL_TEMPLATE).render(**data)).write_pdf()