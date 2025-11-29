from jinja2 import Template
from weasyprint import HTML, CSS
import base64
import os

EXTRACT_TEMPLATE = """
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
    
    <style>
        @page { size: A4; margin: 20mm; }
        
        body { 
            line-height: 2.0; 
            margin: 0;
            padding: 0;
            color: #000;
        }

        p, div { margin-top: 0; margin-bottom: 0; }

        /* ЗАГОЛОВОК */
        .header-title {
            font-family: 'Oswald', sans-serif;
            font-size: 36pt;
            line-height: 1;
            margin-top: 10pt;
            margin-bottom: 0pt;
            color: #333;
        }

        /* ЛІНІЯ (Опустив нижче) */
        .divider {
            border-bottom: 3px solid #333;
            margin-top: 25pt;   /* Було 5pt, стало 25pt - лінія опустилася */
            margin-bottom: 10pt;
            width: 100%;
        }

        /* Roboto Condensed */
        .roboto-9 {
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 9pt;
        }

        .passport-id {
            font-family: 'Roboto Condensed', sans-serif;
            font-size: 20pt;
            font-weight: 700;
            line-height: 1.2;
        }

        /* Montserrat */
        .mont-11-bold {
            font-family: 'Montserrat', sans-serif;
            font-size: 11pt;
            font-weight: 700;
        }

        .mont-11 {
            font-family: 'Montserrat', sans-serif;
            font-size: 11pt;
            font-weight: 400;
        }

        .mont-9 {
            font-family: 'Montserrat', sans-serif;
            font-size: 9pt;
            font-weight: 400;
        }

        /* Пропуски */
        .spacer-roboto-9 { height: 9pt; }
        .spacer-mont-11 { height: 11pt; }

        /* Підпис */
        .signature-block {
            margin-top: 50pt;
            text-align: right;
            font-family: 'Montserrat', sans-serif;
            font-size: 9pt;
        }
        .signature-img {
            width: 250px; /* Було 150px, зробив більше */
            display: block;
            margin-left: auto;
            margin-bottom: 5px;
        }

    </style>
</head>
<body>

    <div class="header-title">Офіційний витяг про <br>ідентифікаційні дані тварини</div>
    
    <div class="divider"></div>

    <div class="roboto-9">Дата створення: {{ creation_date }}</div>
    
    <div class="spacer-roboto-9"></div>

    <div class="passport-id">{{ passport_id }}</div>

    <!-- Ім'я тепер теж жирним -->
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
        {% if signature_b64 %}
            <img src="data:image/png;base64,{{ signature_b64 }}" class="signature-img">
        {% else %}
            <div style="height: 60px;"></div>
        {% endif %}
        <div style="border-top: 1px solid #ccc; display: inline-block; padding-top: 5px;">
            Затверджено гендиректором «єУлюбленець» Корякін З.П.
        </div>
    </div>

</body>
</html>
"""

def get_image_base64(path: str) -> str | None:
    if not os.path.exists(path):
        return None
    try:
        with open(path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception:
        return None

def create_identification_pdf(data: dict) -> bytes:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(os.path.dirname(current_dir), "assets")
    signature_path = os.path.join(assets_dir, "signature.png")
    
    data["signature_b64"] = get_image_base64(signature_path)

    template = Template(EXTRACT_TEMPLATE)
    html_content = template.render(**data)
    
    return HTML(string=html_content).write_pdf()