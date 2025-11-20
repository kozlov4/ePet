package com.example.epet.ui.services.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R
import androidx.navigation.fragment.navArgs

class ExtractPetFragment : Fragment() {

    private val args: ExtractPetFragmentArgs by navArgs()

    private lateinit var iv_to_back: ImageView
    private lateinit var tv_tittletext: TextView
    private lateinit var tv_description: TextView
    private lateinit var bth_create_extract: AppCompatButton

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_extract_pet, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initExtractInfo()
        initButtons()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_description = view.findViewById(R.id.tv_description)
        bth_create_extract = view.findViewById(R.id.bth_create_extract)
    }

    /** Ініціалізація даних витяга **/
    private fun initExtractInfo() {
        val extractName = args.extractName

        if (extractName == "Витяг з реєстру домашніх тварин") {
            tv_description.setText("• Ім’я тварини\n• Вид\n• Порода\n• Стать\n• Дата народження\n• Колір\n• Фото\n• Інформація про ЦНАП, який видав\n   паспорт\n• Інформація про власника")
        } else if (extractName == "Витяг про щеплення тварини") {
            tv_description.text = "• Список проведених щеплень\n• Виробник вакцини\n• Назва препарату\n• Серія\n• Дата вакцинації\n• Термін дії\n• Дані організації, яка проводили\n   щеплення"
        } else if (extractName == "Витяг за ідентифікаторами") {
            tv_description.text = "• Тип ідентифікатора\n• Номер\n• Дата встановлення\n• Дані тварини\n• Інформація про ЦНАП, що встановила\n   ідентифікатор"
        }
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        bth_create_extract.setOnClickListener {
            val action = ExtractPetFragmentDirections.actionExtractPetToMessage(
                tittletext = "Витяг про улюбленця",
                emoji = "✅",
                main = "Витяг сформовано!",
                description = "Документ про пухнастого буде надіслано вам найближчим часом на email"
            )

            findNavController().navigate(action)
        }
    }
}