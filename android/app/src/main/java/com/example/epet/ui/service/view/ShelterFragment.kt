package com.example.epet.ui.services.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.epet.R
import com.example.epet.data.model.OutputPetShelter

class ShelterFragment : Fragment() {

    private lateinit var card_container: FrameLayout
    private lateinit var ib_like: ImageButton
    private lateinit var ib_dislike: ImageButton
    private lateinit var iv_to_back: ImageView

    private var currentIndex = 0


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_shelter, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initViews(view)
        initButtons()
        showNextCard(animated = false, getPetShelterList())
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        card_container = view.findViewById(R.id.card_container)
        ib_like = view.findViewById(R.id.ib_like)
        ib_dislike = view.findViewById(R.id.ib_dislike)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        ib_like.setOnClickListener {
            swipeCard(exitToLeft = true)
        }

        ib_dislike.setOnClickListener {
            swipeCard(exitToLeft = false)
        }
    }

    /** Повертає приклад даних про повідомлення **/
    private fun getPetShelterList(): List<OutputPetShelter> = listOf(
        OutputPetShelter(R.drawable.icon_cat_test, "Донні", "Ч", "Метис", "24.02.2020"),
        OutputPetShelter(R.drawable.icon_cat_test, "Мурзік", "Ч", "Британський", "11.08.2019"),
        OutputPetShelter(R.drawable.icon_cat_test, "Луна", "Ж", "Сіамський", "03.05.2021"),
        OutputPetShelter(R.drawable.icon_cat_test, "Сніжок", "Ч", "Ангор", "17.12.2022"),
        OutputPetShelter(R.drawable.icon_cat_test, "Белла", "Ж", "Шотландський", "29.07.2020"),
        OutputPetShelter(R.drawable.icon_cat_test, "Барсік", "Ч", "Метис", "10.01.2018")
    )

    /** Показ наступної картки **/
    private fun showNextCard(animated: Boolean = true, petList: List<OutputPetShelter>) {
        if (currentIndex >= petList.size) return

        val pet = petList[currentIndex]
        val cardView = layoutInflater.inflate(R.layout.item_shelter, card_container, false)

        val iv_photo = cardView.findViewById<ImageView>(R.id.iv_photo)
        val tv_name = cardView.findViewById<TextView>(R.id.tv_drug_name)
        val tv_sex = cardView.findViewById<TextView>(R.id.tv_sex)
        val tv_breed = cardView.findViewById<TextView>(R.id.tv_breed)
        val tv_birth_date = cardView.findViewById<TextView>(R.id.tv_breed)

        iv_photo.setImageResource(pet.image)
        tv_name.text = pet.name
        tv_sex.text = "Стать: ${pet.sex}"
        tv_breed.text = "Порода: ${pet.breed}"
        tv_birth_date.text = pet.birthDate

        if (animated) {
            cardView.scaleX = 0.9f
            cardView.scaleY = 0.9f
            cardView.alpha = 0f
        }

        card_container.addView(cardView, 0)

        if (animated) {
            cardView.animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(350)
                .start()
        }
    }

    /** Анімація свайпу картки **/
    private fun swipeCard(exitToLeft: Boolean) {
        if (card_container.childCount == 0) return

        val topCard = card_container.getChildAt(card_container.childCount - 1)
        val direction = if (exitToLeft) -1 else 1

        topCard.animate()
            .translationXBy(direction * 800f)
            .rotationBy(direction * 25f)
            .alpha(0f)
            .setDuration(400)
            .withEndAction {
                card_container.removeView(topCard)
                currentIndex++
                showNextCard(animated = true, getPetShelterList())
            }
            .start()
    }
}
